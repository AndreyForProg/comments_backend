export default `
  getComments(limit: Int, offset: Int, orderBy: String, order: String): CommentsResponse
  searchComments(query: String!, limit: Int, offset: Int): SearchCommentsResponse
`
