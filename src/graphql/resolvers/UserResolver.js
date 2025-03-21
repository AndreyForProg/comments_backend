const { UserService } = require('../../services')

class UserResolver {
  constructor() {
    this.resolvers = {
      User: {},
      Query: {
        getUserByEmail: this.getUserByEmail.bind(this),
        getAllUsers: this.getAllUsers.bind(this),
      },
      Mutation: {
        createUser: this.createUser.bind(this),
        deleteUser: this.deleteUser.bind(this),
      },
    }
  }

  async getUserByEmail(parent, { email }, context) {
    const { db } = context
    const userService = new UserService(db)
    return await userService.getUserByEmail(email)
  }

  async getAllUsers(parent, args, context) {
    const { db } = context
    const userService = new UserService(db)
    const users = await userService.getUsers()
    return users
  }

  async createUser(parent, { input }, context) {
    const { db } = context
    const userService = new UserService(db)
    return await userService.createUser(input)
  }

  async deleteUser(parent, { id }, context) {
    const { db } = context
    const userService = new UserService(db)
    return await userService.deleteUser(id)
  }
}

module.exports = new UserResolver().resolvers
