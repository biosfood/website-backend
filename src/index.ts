import { User } from './database'
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from './resolvers'
import { config } from 'dotenv'
import express, { Express } from 'express';

config()

const types = `#graphql
  type Resource {
    id: Int
    resourceType: String
    name: String
    preview: String
    content: String
  }

  type User {
    id: Int
    name: String
    email: String
    profilePicture: Resource
    resources: [Resource]
  }

  type Query {
    userData(token: String): User
    resource(token: String, id: Int): Resource
  }

  type Mutation {
    createUser(name: String, email: String, password: String): User
    login(email: String, password: String): String
    changeName(token: String, name: String): User
    createResource(token: String, type: String, name: String, preview: String, content: String): Resource
    updateResource(token: String, id: Int, preview: String, content: String): Boolean
    deleteResource(token: String, id: Int): Boolean
    setProfilePicture(token: String, id: Int): Boolean
    changePassword(token: String, newPassword: String): Boolean
    changeEmail(token: String, newEmail: String): Boolean
  }
`

const server = new ApolloServer({
  typeDefs: types,
  resolvers,
});
await server.start()
const app = express();
app.use(express.json({ limit: '50mb' }))
server.applyMiddleware({app, cors: {origin: "*"}})
app.listen(4000)
