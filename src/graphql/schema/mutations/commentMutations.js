module.exports = `
  createComment(text: String!, email: String!, nickname: String!, parentId: ID, homePage: String, file: Upload): Comment
  deleteComment(id: ID!): Boolean
`
