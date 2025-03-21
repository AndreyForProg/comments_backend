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

  async getComments() {
    try {
      console.log('getComments service')
      return await this.Comment.findAll({
        include: [{ model: this.User, as: 'user' }],
      })
    } catch (error) {
      throw new Error(`Error fetching comments: ${error.message}`)
    }
  }

  async createComment(commentData) {
    try {
      const newUser = await this.User.create({
        email: commentData.email,
        nickname: commentData.nickname,
      })
      return await this.Comment.create({
        ...commentData,
        userId: newUser.id,
      })
    } catch (error) {
      throw new Error(`Error creating comment: ${error.message}`)
    }
  }

  async deleteComment(id) {
    try {
      const comment = await this.Comment.findByPk(id)
      if (!comment) {
        throw new Error('Comment not found')
      }
      await comment.destroy()
      return true
    } catch (error) {
      throw new Error(`Error deleting comment: ${error.message}`)
    }
  }
}

module.exports = CommentService
