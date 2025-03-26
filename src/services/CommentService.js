import { esClient } from '../../config/elasticConf.js'
import FileService from './FileService.js'
import CommentValidator from './СommentValidatorService.js'

class CommentService {
  constructor(db) {
    this.db = db
    this.Comment = db.getModel('Comment')
    this.User = db.getModel('User')
    this.esClient = esClient
  }

  async getCommentById(id) {
    try {
      return await this.Comment.findByPk(id)
    } catch (error) {
      throw new Error(`Error fetching comment: ${error.message}`)
    }
  }

  createIncludeChildren(depth = 0, maxDepth = 3) {
    if (depth >= maxDepth) {
      return null
    }

    return {
      model: this.Comment,
      as: 'children',
      include: [
        {
          model: this.User,
          as: 'user',
          attributes: ['id', 'email', 'nickname'],
        },
        this.createIncludeChildren(depth + 1, maxDepth),
      ].filter(Boolean),
      attributes: ['id', 'text', 'parentId', 'homePage', 'userId', 'filePath', 'createdAt', 'updatedAt'],
    }
  }

  async getComments({ limit = 25, offset = 0, orderBy = 'createdAt', order = 'DESC' }) {
    try {
      let orderByClause
      switch (orderBy) {
        case 'nickname':
        case 'email':
          orderByClause = [[{ model: this.User, as: 'user' }, orderBy, order]]
          break
        default:
          orderByClause = [[orderBy, order]]
      }

      // Получаем общее количество всех комментариев
      const total = await this.Comment.count()

      // Сначала получаем все комментарии (родительские и дочерние)
      const allComments = await this.Comment.findAll({
        order: orderByClause,
        include: [
          {
            model: this.User,
            as: 'user',
            attributes: ['id', 'email', 'nickname', 'createdAt', 'updatedAt'],
          },
        ],
        attributes: ['id', 'text', 'parentId', 'homePage', 'userId', 'filePath', 'createdAt', 'updatedAt'],
      })

      // Организуем комментарии в древовидную структуру
      const commentTree = []
      const commentMap = new Map()

      // Создаем Map всех комментариев
      allComments.forEach(comment => {
        commentMap.set(comment.id, { ...comment.toJSON(), children: [] })
      })

      // Строим дерево
      allComments.forEach(comment => {
        const commentData = commentMap.get(comment.id)
        if (comment.parentId === null) {
          commentTree.push(commentData)
        } else {
          const parent = commentMap.get(comment.parentId)
          if (parent) {
            parent.children.push(commentData)
          }
        }
      })

      // Функция для получения плоского списка комментариев с учетом порядка
      const flattenComments = comments => {
        const result = []
        const traverse = comment => {
          result.push(comment)
          comment.children.forEach(traverse)
        }
        comments.forEach(traverse)
        return result
      }

      // Получаем плоский список всех комментариев
      const flatComments = flattenComments(commentTree)

      // Применяем пагинацию к плоскому списку
      const paginatedComments = flatComments.slice(offset, offset + limit)

      // Функция для построения дерева из выбранных комментариев
      const buildSelectedTree = selectedComments => {
        const selectedIds = new Set(selectedComments.map(c => c.id))
        const selectedTree = []
        const selectedMap = new Map()

        // Создаем Map только для выбранных комментариев
        selectedComments.forEach(comment => {
          selectedMap.set(comment.id, { ...comment, children: [] })
        })

        // Строим дерево только из выбранных комментариев
        selectedComments.forEach(comment => {
          const commentData = selectedMap.get(comment.id)
          if (!comment.parentId || !selectedIds.has(comment.parentId)) {
            selectedTree.push(commentData)
          } else {
            const parent = selectedMap.get(comment.parentId)
            if (parent) {
              parent.children.push(commentData)
            }
          }
        })

        return selectedTree
      }

      return {
        comments: buildSelectedTree(paginatedComments),
        total,
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw new Error(`Error fetching comments: ${error.message}`)
    }
  }

  async createComment(commentData) {
    try {
      const validation = CommentValidator.validate(commentData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      let filePath = null
      if (commentData.file) {
        filePath = await FileService.processFile(commentData.file)
      }

      let user = await this.User.findOne({
        where: { email: commentData.email },
      })

      if (!user) {
        user = await this.User.create({
          email: commentData.email,
          nickname: commentData.nickname,
        })
      }

      const comment = await this.Comment.create({
        text: commentData.text,
        parentId: commentData.parentId,
        homePage: commentData.homePage,
        userId: user.id,
        filePath: filePath,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await this.indexComment(comment, user)

      return comment
    } catch (error) {
      console.error('General error in createComment:', error)
      throw error
    }
  }

  // Индексация комментария в Elasticsearch
  async indexComment(comment, user) {
    try {
      await this.esClient.index({
        index: 'comments',
        id: comment.id.toString(),
        body: {
          id: comment.id,
          text: comment.text,
          homePage: comment.homePage,
          createdAt: comment.createdAt,
          user: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
          },
        },
      })
    } catch (error) {
      console.error('Error indexing comment:', error)
      console.warn('Comment created but not indexed in Elasticsearch')
    }
  }

  async searchComments({ query, limit = 10, offset = 0 }) {
    try {
      const searchResult = await this.esClient.search({
        index: 'comments',
        body: {
          from: offset,
          size: limit,
          query: {
            bool: {
              should: [
                {
                  nested: {
                    path: 'user',
                    query: {
                      multi_match: {
                        query: query,
                        fields: ['user.email', 'user.nickname'],
                        type: 'phrase_prefix',
                      },
                    },
                  },
                },
                {
                  match_phrase_prefix: {
                    text: query,
                  },
                },
              ],
            },
          },
        },
      })

      const hits = searchResult.hits.hits
      const total = searchResult.hits.total.value

      const commentIds = hits.map(hit => hit._source.id)
      const comments = await this.Comment.findAll({
        where: {
          id: commentIds,
        },
        include: [
          {
            model: this.User,
            as: 'user',
            attributes: ['id', 'email', 'nickname'],
          },
          this.createIncludeChildren(0, 3),
        ],
      })

      return {
        comments,
        total,
      }
    } catch (error) {
      console.error('Error searching comments:', error)
      throw new Error(`Error searching comments: ${error.message}`)
    }
  }

  async deleteComment(id) {
    try {
      const comment = await this.Comment.findByPk(id)
      if (!comment) {
        throw new Error('Comment not found')
      }

      // Удаляем файл, если он есть
      if (comment.filePath) {
        try {
          await FileService.deleteFile(comment.filePath)
        } catch (error) {
          console.warn('Error deleting file:', error)
        }
      }

      // Удаляем из Elasticsearch
      try {
        await this.esClient.delete({
          index: 'comments',
          id: id.toString(),
        })
      } catch (error) {
        console.warn('Error deleting comment from Elasticsearch:', error)
      }

      const childrens = await this.Comment.findAll({
        where: { parentId: comment.id },
      })

      for (const child of childrens) {
        // Удаляем файл дочернего комментария, если есть
        if (child.filePath) {
          try {
            await FileService.deleteFile(child.filePath)
          } catch (error) {
            console.warn('Error deleting child comment file:', error)
          }
        }

        // Удаляем дочерние комментарии из Elasticsearch
        try {
          await this.esClient.delete({
            index: 'comments',
            id: child.id.toString(),
          })
        } catch (error) {
          console.warn('Error deleting child comment from Elasticsearch:', error)
        }
        await child.destroy()
      }

      await comment.destroy()
      return true
    } catch (error) {
      throw new Error(`Error deleting comment: ${error.message}`)
    }
  }
}

export default CommentService
