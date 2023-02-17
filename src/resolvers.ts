import { User } from './database'
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
      return jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '2h'})
    },
    changeName: async(_, { token, name }) =>  {
      const user = await verify(token)
      user.name = name
      user.save()
      return user
    }
  }
};
