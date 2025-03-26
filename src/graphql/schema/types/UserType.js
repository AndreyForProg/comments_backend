const UserType = `
  type User {
    id: ID!
    nickname: String!
    email: String!
    comments: [Comment]
    createdAt: String
    updatedAt: String
  }
  
  input UserInput {
    nickname: String!
    email: String!
  }
  
  input UserUpdateInput {
    nickname: String
    email: String
  }
`

export default UserType
