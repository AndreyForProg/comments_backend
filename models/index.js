'use strict'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Sequelize from 'sequelize'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'

// Импортируем конфиг с помощью динамического импорта
const configPath = path.join(__dirname, '/../config/config.json')
const configJson = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const config = configJson[env]

const db = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

// Используем динамический импорт для загрузки моделей
const loadModels = async () => {
  const files = fs.readdirSync(__dirname).filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.slice(-3) === '.js' || file.slice(-4) === '.mjs') &&
      file.indexOf('.test.js') === -1
    )
  })

  for (const file of files) {
    const modelModule = await import(`file://${path.join(__dirname, file)}`)
    const model = modelModule.default(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  }

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })
}

// Вызываем функцию загрузки моделей
await loadModels()

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
