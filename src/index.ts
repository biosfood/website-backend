import { User } from './database'
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from './resolvers'
import { config } from 'dotenv'
import express, { Express } from 'express';

config()

const types = `#graphql
  type Article {
    title: String
    author: String
    content: String
  }

  type Resource {
    title: String
    content: String
  }

  type User {
    id: Int
    name: String
    email: String
  }

  type Query {
    users: [User]
  }

  type Mutation {
    createUser(name: String, email: String, password: String): User
    login(email: String, password: String): String
    changeName(token: String, name: String): User
  }
`

const server = new ApolloServer({
  typeDefs: types,
  resolvers,
});
await server.start()
const app = express();
server.applyMiddleware({app, cors: {origin: "*"}})
app.listen(4000)
