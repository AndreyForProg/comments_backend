const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const sharp = require('sharp')

class FileService {
  constructor() {
    // Настройка основных параметров
    this.uploadDir = path.join(process.cwd(), 'files')
    this.maxImageDimensions = { width: 320, height: 240 }
    this.maxTextFileSize = 102400 // 100кб в байтах
  }

  async init() {
    try {
      await fsPromises.mkdir(this.uploadDir, { recursive: true })
    } catch (error) {
      console.error('Ошибка при создании директории:', error)
      throw error
    }
  }

  async processFile(file) {
    const { filename, createReadStream } = file.file
    const extension = path.extname(filename).toLowerCase()

    // Проверяем тип файла и обрабатываем соответственно
    if (this.isImage(extension)) {
      return await this.processImage(createReadStream, filename)
    } else if (this.isTextFile(extension)) {
      return await this.processTextFile(createReadStream, filename)
    }
    throw new Error('Неподдерживаемый тип файла. Разрешены только JPG, GIF, PNG и TXT файлы.')
  }

  async processImage(createReadStream, filename) {
    // Создаем уникальное имя файла и пути
    const uniqueFilename = `${Date.now()}-${filename}`
    const relativePath = path.join('files', uniqueFilename)
    const outputPath = path.join(this.uploadDir, uniqueFilename)

    // Читаем файл в буфер
    const buffer = await this.readFileToBuffer(createReadStream)

    // Обрабатываем изображение
    const { width, height } = await this.calculateNewImageSize(buffer)

    // Сохраняем обработанное изображение
    await sharp(buffer)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: false,
      })
      .toFile(outputPath)

    return relativePath
  }

  async readFileToBuffer(createReadStream) {
    // Метод для чтения файла в буфер
    return new Promise((resolve, reject) => {
      const chunks = []
      createReadStream()
        .on('data', chunk => chunks.push(chunk))
        .on('end', () => resolve(Buffer.concat(chunks)))
        .on('error', reject)
    })
  }

  async calculateNewImageSize(buffer) {
    const metadata = await sharp(buffer).metadata()
    const aspectRatio = metadata.width / metadata.height
    let width = metadata.width
    let height = metadata.height

    // Подгоняем размеры под максимально допустимые
    if (width > this.maxImageDimensions.width) {
      width = this.maxImageDimensions.width
      height = Math.round(width / aspectRatio)
    }
    if (height > this.maxImageDimensions.height) {
      height = this.maxImageDimensions.height
      width = Math.round(height * aspectRatio)
    }

    return { width, height }
  }

  async processTextFile(createReadStream, filename) {
    // Читаем и проверяем размер текстового файла
    const content = await this.readTextFileWithSizeCheck(createReadStream)

    // Сохраняем файл
    const uniqueFilename = `${Date.now()}-${filename}`
    const relativePath = path.join('files', uniqueFilename)
    const outputPath = path.join(this.uploadDir, uniqueFilename)

    await fsPromises.writeFile(outputPath, content)
    return relativePath
  }

  async readTextFileWithSizeCheck(createReadStream) {
    const chunks = []
    let totalSize = 0

    for await (const chunk of createReadStream()) {
      chunks.push(chunk)
      totalSize += chunk.length
      if (totalSize > this.maxTextFileSize) {
        throw new Error('Размер текстового файла превышает лимит в 100кб')
      }
    }

    return Buffer.concat(chunks)
  }

  isImage(extension) {
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(extension)
  }

  isTextFile(extension) {
    return extension === '.txt'
  }

  getPublicPath(filePath) {
    return `${process.env.BASE_URL}/${filePath}`
  }

  async deleteFile(filePath) {
    try {
      const absolutePath = path.join(process.cwd(), filePath)

      const exists = await fsPromises
        .access(absolutePath)
        .then(() => true)
        .catch(() => false)

      if (exists) {
        await fsPromises.unlink(absolutePath)
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      throw new Error(`Failed to delete file: ${error.message}`)
    }
  }
}

module.exports = new FileService()
