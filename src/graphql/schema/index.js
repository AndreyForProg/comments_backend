const { makeExecutableSchema } = require('@graphql-tools/schema')
const { gql } = require('apollo-server-express')
const types = require('./types')
const queries = require('./queries')
const mutations = require('./mutations')
const resolvers = require('../resolvers')

const typeDefs = gql`
  ${types}
  
  type Query {
    ${queries}
  }
  
  type Mutation {
    ${mutations}
  }
`

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

module.exports = schema
