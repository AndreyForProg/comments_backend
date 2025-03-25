const express = require('express')
const cors = require('cors')
const { ApolloServer } = require('apollo-server-express')
const schema = require('./graphql/schema')
const Database = require('./database/Database')

class App {
  constructor() {
    this.app = express()
    this.database = new Database()
    this.setupMiddlewares()
    this.setupDatabase()
    this.setupGraphQL()
  }

  setupMiddlewares() {
    this.app.use(express.json())
    this.app.use(cors())
  }

  async setupDatabase() {
    try {
      console.log('Initializing database connection...')
      await this.database.connect()
      console.log('Database connected and synchronized successfully')
    } catch (error) {
      console.error('Fatal database setup error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
      process.exit(1) // Завершаем процесс при критической ошибке
    }
  }

  async setupGraphQL() {
    const apolloServer = new ApolloServer({
      schema,
      context: ({ req }) => {
        return {
          db: this.database,
        }
      },
    })

    await apolloServer.start()
    apolloServer.applyMiddleware({ app: this.app, path: '/graphql' })

    this.app.get('/health', (req, res) => {
      res.status(200).send('OK')
    })
  }
}

const appInstance = new App()
module.exports = { app: appInstance.app }
