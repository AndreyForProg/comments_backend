module.exports = `
  type Comment {
    id: ID!
    text: String!
    userId: ID!
    parentId: ID
    homePage: String
    user: User
    createdAt: String
    updatedAt: String
  }

  input CommentInput {
    email: String!
    nickname: String!
    text: String!
    parentId: ID
    homePage: String
  }
`
