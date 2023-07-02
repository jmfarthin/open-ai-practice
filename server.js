const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
// const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
require("dotenv").config()

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// app.post("/api/openaitest", async (req,res) => {
//     const response = await callOpenAI()
//     console.log("response successful")
//     console.log(response)
//     console.log(`===========================================`)
//     console.log(`===========================================`)

//     console.log(`===========================================`)

//     console.log(`===========================================`)
//     var {text} = response?.data?.choices[0]
//     if(!text){
//         console.log("My api failed!")
//         //error handle accordingly
//     }

//     res.json({message: "Ok"})
// })

// new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    // server.applyMiddleware({ app });
    server.applyMiddleware({ app, path: '/graphql' });

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        })
    })
};

// start the server
startApolloServer(typeDefs, resolvers);

// app.listen(PORT, () => {
//     console.log(`API server running on port ${PORT}!`);
//     console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
// })