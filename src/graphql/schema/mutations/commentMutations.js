module.exports = `
  createComment(text: String!, email: String!, nickname: String!, parentId: ID, homePage: String): Comment
  deleteComment(id: ID!): Boolean
`
