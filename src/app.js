import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
// const { graphqlUploadExpress } = require('graphql-upload')
import schema from './graphql/schema/index.js'
import Database from './database/Database.js'
import { createIndex } from '../config/elasticConf.js'
import FileService from './services/FileService.js'
import path from 'path'
import { fileURLToPath } from 'url'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class App {
  constructor() {
    this.app = express()
    this.database = new Database()
    this.setupMiddlewares()
    this.setupDatabase()
    this.setupElasticsearch()
    this.setupGraphQL()
    this.setupFileService()
    this.setupStaticFiles()
  }

  setupMiddlewares() {
    // Установка защитных HTTP-заголовков вручную
    this.app.use((req, res, next) => {
      res.setHeader('X-XSS-Protection', '1; mode=block')
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('X-Frame-Options', 'SAMEORIGIN')
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
      // Базовая политика CSP
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'",
      )
      next()
    })

    this.app.use(
      express.json({
        // Ограничение размера JSON-запроса
        limit: '100kb',
      }),
    )
    this.app.use(
      graphqlUploadExpress({
        maxFileSize: 100000, // 100 KB
        maxFiles: 1,
      }),
    )
    // this.app.use(cors())
  }

  async setupElasticsearch() {
    try {
      console.log('Initializing Elasticsearch...')
      await createIndex()
      console.log('Elasticsearch index created successfully')
    } catch (error) {
      console.error('Elasticsearch setup error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
      console.warn('Application will continue without Elasticsearch functionality')
    }
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
      process.exit(1)
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

  async setupFileService() {
    try {
      await FileService.init()
      console.log('File service initialized successfully')
    } catch (error) {
      console.error('File service initialization error:', error)
      console.warn('Application will continue without file upload functionality')
    }
  }

  // Хранилище файлов
  setupStaticFiles() {
    this.app.use('/files', express.static(path.join(process.cwd(), 'files')))
  }
}

const appInstance = new App()

export const app = appInstance.app
