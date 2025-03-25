class CommentService {
  constructor(db) {
    this.db = db
    this.Comment = db.getModel('Comment')
    this.User = db.getModel('User')
  }

  async getCommentById(id) {
    try {
      return await this.Comment.findByPk(id)
    } catch (error) {
      throw new Error(`Error fetching comment: ${error.message}`)
    }
  }

  createIncludeChildren(depth = 0, maxDepth = 3) {
    if (depth >= maxDepth) {
      return null
    }

    return {
      model: this.Comment,
      as: 'children',
      include: [
        {
          model: this.User,
          as: 'user',
          attributes: ['id', 'email', 'nickname'],
        },
        this.createIncludeChildren(depth + 1, maxDepth),
      ].filter(Boolean),
      attributes: ['id', 'text', 'parentId', 'homePage', 'userId', 'createdAt', 'updatedAt'],
    }
  }

  async getComments({ limit = 2, offset = 0, orderBy = 'createdAt', order = 'DESC' }) {
    try {
      let orderByClause
      switch (orderBy) {
        case 'nickname':
        case 'email':
          orderByClause = [[{ model: this.User, as: 'user' }, orderBy, order]]
          break
        default:
          orderByClause = [[orderBy, order]]
      }

      const [comments, total] = await Promise.all([
        this.Comment.findAll({
          where: {
            parentId: null,
          },
          limit,
          offset,
          order: orderByClause,
          include: [
            {
              model: this.User,
              as: 'user',
              attributes: ['id', 'email', 'nickname', 'createdAt', 'updatedAt'],
            },
            this.createIncludeChildren(0, 3),
          ],
          attributes: ['id', 'text', 'parentId', 'homePage', 'userId', 'createdAt', 'updatedAt'],
        }),
        this.Comment.count({
          where: {
            parentId: null,
          },
        }),
      ])

      return {
        comments,
        total,
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw new Error(`Error fetching comments: ${error.message}`)
    }
  }

  async createComment(commentData) {
    try {
      console.log('Starting comment creation with data:', commentData)

      let user
      try {
        // Сначала ищем существующего пользователя
        user = await this.User.findOne({
          where: { email: commentData.email },
        })

        if (!user) {
          console.log('Creating new user...')
          user = await this.User.create({
            email: commentData.email,
            nickname: commentData.nickname,
          }).catch(error => {
            console.log('Create user error details:', {
              name: error.name,
              message: error.message,
              errors: error.errors,
              sql: error.sql,
              original: error.original,
            })

            // Проверяем специфические ошибки
            if (error.name === 'SequelizeValidationError') {
              throw new Error('Validation error: ' + error.message)
            }
            if (error.name === 'SequelizeUniqueConstraintError') {
              throw new Error('User already exists')
            }
            throw error
          })
        } else {
          console.log('Found existing user:', user.toJSON())
        }

        console.log('User ready:', user.toJSON())

        // Создаем комментарий
        const comment = await this.Comment.create({
          text: commentData.text,
          parentId: commentData.parentId,
          homePage: commentData.homePage,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        return comment
      } catch (error) {
        console.error('Full error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          original: error.original,
        })
        throw error
      }
    } catch (error) {
      console.error('General error in createComment:', error)
      throw error
    }
  }

  async deleteComment(id) {
    try {
      const comment = await this.Comment.findByPk(id)
      if (!comment) {
        throw new Error('Comment not found')
      }
      const childrens = await this.Comment.findAll({
        where: { parentId: comment.id },
      })
      for (const child of childrens) {
        await child.destroy()
      }
      await comment.destroy()
      return true
    } catch (error) {
      throw new Error(`Error deleting comment: ${error.message}`)
    }
  }
}

module.exports = CommentService
