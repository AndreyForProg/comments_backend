import { CommentService } from '../../services/index.js'
import CommentValidator from '../../services/СommentValidatorService.js'

class CommentResolver {
  constructor() {
    this.resolvers = {
      Comment: {},
      Query: {
        getComments: this.getComments.bind(this),
        searchComments: this.searchComments.bind(this),
      },
      Mutation: {
        createComment: this.createComment.bind(this),
        deleteComment: this.deleteComment.bind(this),
      },
    }
  }

  async getComments(parent, { limit, offset, orderBy, order, file }, context) {
    const { db } = context
    const commentService = new CommentService(db)
    return await commentService.getComments({ limit, offset, orderBy, order, file })
  }

  async createComment(_parent, { email, nickname, text, parentId, homePage, file }, context) {
    if (!context || !context.db) {
      throw new Error('Database connection required')
    }

    // Используем валидатор для проверки входных данных
    const validationResult = CommentValidator.validate({
      email,
      nickname,
      text,
      homePage,
    })

    // Если есть ошибки валидации, выбрасываем их
    if (!validationResult.isValid) {
      throw new Error(validationResult.errors.join(', '))
    }

    const { db } = context
    const commentService = new CommentService(db)
    return await commentService.createComment({
      email,
      nickname,
      text,
      parentId,
      homePage,
      file,
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

  async searchComments(_parent, { query, limit, offset }, context) {
    if (!context || !context.db) {
      throw new Error('Database connection required')
    }
    const { db } = context
    const commentService = new CommentService(db)
    return await commentService.searchComments({ query, limit, offset })
  }
}

export default new CommentResolver().resolvers
