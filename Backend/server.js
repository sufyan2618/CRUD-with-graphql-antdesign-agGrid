import express from 'express';
import cors from 'cors';
import gql from "graphql-tag";
import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { expressMiddleware } from '@as-integrations/express5';
import resolvers from "./resolvers/resolvers.js";
import typeDefs from './schemas/schema.js';



const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());


const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

await server.start();
app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => ({ headers: req.headers }),
  })
);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});