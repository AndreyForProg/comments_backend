const { CommentService, UserService } = require('../../services')

class CommentResolver {
  constructor() {
    this.resolvers = {
      Comment: {},
      Query: {
        getComments: this.getComments.bind(this),
      },
      Mutation: {
        createComment: this.createComment.bind(this),
        deleteComment: this.deleteComment.bind(this),
      },
    }
  }

  async getComments(parent, { limit, offset, orderBy, order }, context) {
    const { db } = context
    const commentService = new CommentService(db)
    return await commentService.getComments({ limit, offset, orderBy, order })
  }

  async createComment(_parent, { email, nickname, text, parentId, homePage }, context) {
    if (!context || !context.db) {
      throw new Error('Database connection required')
    }
    if (!email || !nickname || !text) {
      throw new Error('Invalid input parameters')
    }
    const { db } = context
    const commentService = new CommentService(db)
    return await commentService.createComment({
      email,
      nickname,
      text,
      parentId,
      homePage,
    })
  }

  async deleteComment(_parent, { id }, context) {
    if (!context || !context.db) {
      throw new Error('Database connection required')
    }
    if (typeof id === 'undefined') {
      throw new Error('Comment ID is required')
    }

    const { db } = context
    const commentService = new CommentService(db)
    return await commentService.deleteComment(id)
  }
}

module.exports = new CommentResolver().resolvers
