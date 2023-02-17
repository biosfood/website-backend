import { User } from './database'
import { GraphQLError } from 'graphql'

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
    }
  }
};
