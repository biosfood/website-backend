import { User } from './database'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'

export const resolvers = {
  Query: {
    users: async () => await User.findAll()
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      if ((await User.findAll({where: {name: name}})).length) {
        throw new GraphQLError("username already taken")
      }
      if ((await User.findAll({where: {email: email}})).length) {
        throw new GraphQLError("email already used by another username")
      }
      return await User.create({name, email})
    },
    loginUser: async (_, { name }) => {
      // TODO: check password
      const user = await User.findOne({where: {name}})
      if (!user) {
        throw new GraphQLError("account unknown")
      }
      const data = {
        userId: user.id,
      }
      return jwt.sign(data, process.env.JWT_SECRET)
    }
  }
};
