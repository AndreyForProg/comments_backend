const db = require('../../models')

class Database {
  constructor() {
    this.sequelize = db.sequelize
    this.models = db
  }

  getModel(modelName) {
    return this.models[modelName]
  }

  async connect() {
    try {
      await this.sequelize.authenticate()
      console.log('Database connection has been established successfully.')
    } catch (error) {
      console.error('Unable to connect to the database:', error)
      throw error
    }
  }

  async sync(options = {}) {
    return await this.sequelize.sync(options)
  }

  async transaction(callback) {
    return await this.sequelize.transaction(callback)
  }
}

module.exports = Database
