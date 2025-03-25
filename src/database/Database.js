const db = require('../../models')

class Database {
  constructor() {
    this.sequelize = db.sequelize
    this.models = db
    console.log('Available models:', Object.keys(this.models))
  }

  getModel(modelName) {
    const model = this.models[modelName]
    if (!model) {
      console.error(`Model ${modelName} not found. Available models:`, Object.keys(this.models))
      throw new Error(`Model ${modelName} not found`)
    }
    return model
  }

  async connect() {
    try {
      await this.sequelize.authenticate()
      console.log('Database connection has been established successfully.')

      // Синхронизируем модели с базой данных
      await this.sync({ alter: true })
      console.log('Database models synchronized successfully.')
    } catch (error) {
      console.error('Unable to connect to the database:', {
        error: error.message,
        stack: error.stack,
        name: error.name,
      })
      throw error
    }
  }

  async sync(options = {}) {
    try {
      console.log('Starting database sync...')
      await this.sequelize.sync(options)
      console.log('Database sync completed successfully')
    } catch (error) {
      console.error('Database sync failed:', error)
      throw error
    }
  }

  async transaction(callback) {
    return await this.sequelize.transaction(callback)
  }
}

module.exports = Database
