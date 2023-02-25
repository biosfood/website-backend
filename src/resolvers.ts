import { User, Resource } from './database'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'

function verify(token: String): Promise<User> {
  return new Promise<User>((resolve, reject) =>  {
    jwt.verify(token, process.env.JWT_SECRET, async function(error, decoded) {
      if (error) {
        return reject()
      }
      const user = await User.findOne({where : {id: decoded.userId}, include: {model: Resource, as: 'profilePicture'}})
      if (!user) {
        return reject()
      }
      resolve(user)
    })
  }).catch(() => {throw new GraphQLError("access denied")})
}

export const resolvers = {
  Query: {
    userData: async (_, {token}) => await verify(token),
    resources: async (_, {token}) => {
      const user = await verify(token)
      return await Resource.findAll({where: {owner: user.id}})
    },
    resource: async (_, {token, id}) => {
      const user = await verify(token)
      return await Resource.findOne({where: {owner: user.id, id}})
    }
  },
  Mutation: {
    createUser: async (_, { name, email, password }) => {
      if ((await User.findAll({where: {name: name}})).length) {
        throw new GraphQLError("username already taken")
      }
      if ((await User.findAll({where: {email: email}})).length) {
        throw new GraphQLError("email already used by another username")
      }
      return await User.create({name, email, password, profilePicture: 0})
    },
    createResource: async (_, {token, name, preview, content}) => {
      const user = await verify(token)
      return await Resource.create({owner: user.id, name, preview, content})
    },
    deleteResource: async (_, {token, id}) => {
      const user = await verify(token)
      Resource.destroy({where: {owner: user.id, id}})
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
      user.update({profilePictureId: id ? (await Resource.findOne({where: {owner: user.id, id}})).id : 0})
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
