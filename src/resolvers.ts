import { User, Resource, datatypes } from './database'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'

function verify(token: String): Promise<User> {
  return new Promise<User>((resolve, reject) =>  {
    jwt.verify(token, process.env.JWT_SECRET, async function(error, decoded) {
      if (error) {
        return reject()
      }
      const user = await User.findOne({where : {id: decoded.userId}})
      if (!user) {
        return reject()
      }
      resolve(user)
    })
  }).catch(() => {throw new GraphQLError("access denied")})
}

export const resolvers = {
  Query: {
    users: async () => {
      return await User.findAll({include: [{model: Resource, as: 'profilePicture'}]})
    },
    userData: async (_, {token}) => {
      const user = await verify(token)
      const result = await User.findOne({where: {id: user.id}, include: [
        {model: Resource, as: 'resources'},
        {model: Resource, as: 'profilePicture'},
        ]
      })
      result.resources.forEach(element => {
        element.resourceType = datatypes[element.type]
      });
      return result
    },
    resources: async (_, {username}) => {
      const user = await User.findOne({where: {name: username}})
      if (!user) {
        throw new GraphQLError("user doesn't exist")
      }
      return await Resource.findAll({where: {UserId: user.id}})
    },
    resource: async (_, {id}) => {
      return await Resource.findOne({where: {id}})
    },
    resourceByName: async (_, {username, name}) => {
      const user = await User.findOne({where: {name: username}})
      if (!user) {
        throw new GraphQLError("user doesn't exist")
      }
      return await Resource.findOne({where: {UserId: user.id, name}})
    },
  },
  Mutation: {
    createUser: async (_, { name, email, password }) => {
      if ((await User.findAll({where: {name: name}})).length) {
        throw new GraphQLError("username already taken")
      }
      if ((await User.findAll({where: {email: email}})).length) {
        throw new GraphQLError("email already used by another username")
      }
      const user = await User.create({name, email, password})
      await Resource.create({UserId: user.id, name: '/', preview: 'root article', content: 'change me!', type: datatypes.indexOf('article')})
      return user
    },
    createResource: async (_, {token, type, name, preview, content}) => {
      const user = await verify(token)
      const typeIndex = datatypes.indexOf(type)
      if (typeIndex < 0) {
        throw new GraphQLError("unknown file type")
      }
      return await Resource.create({UserId: user.id, name, preview, content, type: typeIndex})
    },
    updateResource: async (_, {token, id, preview, content}) => {
      const user = await verify(token)
      const resource = await Resource.findOne({where: {UserId: user.id, id}})
      if (!resource) {
        throw new GraphQLError("resource not found")
      }
      resource.update({preview, content})
      return true
    },
    deleteResource: async (_, {token, id}) => {
      const user = await verify(token)
      Resource.destroy({where: {UserId: user.id, id}})
      return true
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({where: {email, password}})
      if (!user) {
        throw new GraphQLError("access denied")
      }
      return jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '2h'})
    },
    changeName: async(_, { token, name }) =>  {
      const user = await verify(token)
      user.update({name})
      return user
    },
    setProfilePicture: async(_, {token, id}) => {
      const user = await verify(token)
      user.update({profilePictureId: id ? (await Resource.findOne({where: {UserId: user.id, id}})).id : 0})
      return true
    },
    changePassword: async(_, {token, newPassword}) => {
      const user = await verify(token)
      user.update({password: newPassword})
      return true
    },
    changeEmail: async(_, {token, newEmail}) => {
      const user = await verify(token)
      user.update({email: newEmail})
      return true
    },
  }
};
