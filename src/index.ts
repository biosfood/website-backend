import { User } from './database'
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from './resolvers'
import { config } from 'dotenv'

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
    createUser(name: String, email: String): User
    loginUser(name: String): String
  }
`

const server = new ApolloServer({
  typeDefs: types,
  resolvers,
});

const {url} = await startStandaloneServer(server, {listen: {port: 4000}})

console.log(`server started at ${url}`)
