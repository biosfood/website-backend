import { ApolloServer } from '@apollo/server';
import { resolvers } from './resolvers.js'
import { config } from 'dotenv'
import express from 'express';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import { Resource } from './database.js';
import bodyParser from 'body-parser';

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
    hostname: String
    profilePicture: Resource
    resources: [Resource]
  }

  type Query {
    users: [User]
    userData(token: String): User
    resources(username: String): [Resource]
    resource(id: Int): Resource
    resourceByName(username: String, name: String): Resource
    resourceByHostname(hostname: String, name: String): Resource
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
    changeHostname(token: String, newHostname: String): Boolean
  }
`

const server = new ApolloServer({
  typeDefs: types,
  resolvers,
});
await server.start()
const app = express();
app.use(express.json({ limit: '50mb' }))
app.get('/resource', async (request, response) => {
  if (request.query.id == undefined) {
    response.send("error")
    return
  }
  const resource = await Resource.findOne({where: {id: request.query.id}})
  if (resource == undefined) {
    response.send("error")
    return
  }
  const base64 = resource.content.substring(resource.content.search(","), resource.content.length)
  var img = Buffer.from(base64, 'base64');
  response.writeHead(200, {
   'Content-Type': 'image',
   'Content-Length': img.length
  });
  response.end(img); 
})

// server.applyMiddleware({app, cors: {origin: "*"}})
app.use('/graphql', cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server));
app.listen(4000)
