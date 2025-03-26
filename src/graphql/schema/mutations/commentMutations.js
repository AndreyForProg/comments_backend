const commentMutations = `
  createComment(email: String!, nickname: String!, text: String!, parentId: ID, homePage: String, file: Upload): Comment
  deleteComment(id: ID!): Boolean
`

export default commentMutations
