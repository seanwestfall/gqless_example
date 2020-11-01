const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require('./schema');
const app = express();
// MIDDLEWARE
app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}));
app.listen(5000, () => console.log("Server running on port 5000"));
