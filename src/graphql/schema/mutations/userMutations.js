const userMutations = `
  createUser(input: UserInput!): User
  deleteUser(id: ID!): Boolean
`

export default userMutations
