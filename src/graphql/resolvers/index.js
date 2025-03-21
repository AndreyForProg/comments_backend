const userResolvers = require('./UserResolver')
const commentResolvers = require('./CommentResolver')

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

module.exports = resolvers
