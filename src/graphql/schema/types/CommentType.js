module.exports = `
  type Comment {
    id: ID!
    text: String!
    userId: ID!
    parentId: ID
    homePage: String
    filePath: String
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
    file: Upload
  }

  type CommentsResponse {
    comments: [Comment]!
    total: Int!
  }

  type SearchCommentsResponse {
    comments: [Comment]!
    total: Int!
  }
`
