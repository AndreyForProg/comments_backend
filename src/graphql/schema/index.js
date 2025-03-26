import { makeExecutableSchema } from '@graphql-tools/schema'
import { gql } from 'apollo-server-express'
import types from './types/index.js'
import queries from './queries/index.js'
import mutations from './mutations/index.js'
import resolvers from '../resolvers/index.js'

const typeDefs = gql`
  ${types}
  
  type Query {
    ${queries}
  }
  
  type Mutation {
    ${mutations}
  }

  scalar Upload
`

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default schema
