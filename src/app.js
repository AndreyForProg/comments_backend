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
      await this.database.connect()
      console.log('Database connected successfully')
    } catch (error) {
      console.error('Database setup error:', error)
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
