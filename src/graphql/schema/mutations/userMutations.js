const userMutations = `
  createUser(input: UserInput!): User
  deleteUser(id: ID!): Boolean
`

module.exports = userMutations
