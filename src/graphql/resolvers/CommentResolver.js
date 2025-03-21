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

  async getComments(parent, args, context) {
    const { db } = context
    const commentService = new CommentService(db)
    return await commentService.getComments()
  }

  async createComment(_parent, args, context) {
    if (!context || !context.db) {
      throw new Error('Database connection required')
    }
    if (!args || typeof args !== 'object') {
      throw new Error('Invalid input parameters')
    }

    const { email, nickname, text, parentId, homePage } = args
    const { db } = context
    const commentService = new CommentService(db)
    return await commentService.createComment({ email, nickname, text, parentId, homePage })
  }

  async deleteComment(_parent, args, context) {
    if (!context || !context.db) {
      throw new Error('Database connection required')
    }
    if (!args || typeof args !== 'object' || !args.id) {
      throw new Error('Comment ID is required')
    }

    const { id } = args
    const { db } = context
    const commentService = new CommentService(db)
    return await commentService.deleteComment(id)
  }
}

module.exports = new CommentResolver().resolvers
