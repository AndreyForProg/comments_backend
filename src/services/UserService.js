class UserService {
  constructor(db) {
    this.db = db
    this.User = db.getModel('User')
    this.Comment = db.getModel('Comment')
  }

  async getUserById(id) {
    try {
      return await this.User.findByPk(id)
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`)
    }
  }

  async getUserByEmail(email) {
    try {
      return await this.User.findOne({ where: { email } })
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`)
    }
  }

  async getUsers(filters = {}) {
    try {
      return await this.User.findAll({ where: filters })
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`)
    }
  }

  async createUser(userData) {
    try {
      console.log('userData', userData)
      return await this.User.create(userData)
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`)
    }
  }

  async updateUser(id, userData) {
    try {
      const user = await this.User.findByPk(id)
      if (!user) {
        throw new Error('User not found')
      }
      return await user.update(userData)
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`)
    }
  }

  async deleteUser(id) {
    try {
      const user = await this.User.findByPk(id)
      if (!user) {
        throw new Error('User not found')
      }
      await user.destroy()
      return true
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`)
    }
  }

  async getUserComments(userId) {
    try {
      return await this.Comment.findAll({ where: { userId } })
    } catch (error) {
      throw new Error(`Error fetching user comments: ${error.message}`)
    }
  }
}

module.exports = UserService
