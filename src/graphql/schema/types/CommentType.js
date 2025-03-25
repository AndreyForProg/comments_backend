module.exports = `
  type Comment {
    id: ID!
    text: String!
    userId: ID!
    parentId: ID
    homePage: String
    user: User
    children: [Comment]
    createdAt: String
    updatedAt: String
  }

  input CreateCommentInput {
    email: String!
    nickname: String!
    text: String!
    parentId: ID
    homePage: String
  }

  type CommentsResponse {
    comments: [Comment]!
    total: Int!
  }
`
