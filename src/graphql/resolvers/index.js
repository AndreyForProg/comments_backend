import userResolvers from './UserResolver.js'
import commentResolvers from './CommentResolver.js'

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...commentResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
}

export default resolvers
