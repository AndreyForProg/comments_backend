import { Client } from '@elastic/elasticsearch'

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
})

async function createIndex() {
  try {
    const indexExists = await esClient.indices.exists({
      index: 'comments',
    })

    if (!indexExists) {
      await esClient.indices.create({
        index: 'comments',
        body: {
          mappings: {
            properties: {
              id: { type: 'long' },
              text: { type: 'text' },
              homePage: { type: 'keyword' },
              createdAt: { type: 'date' },
              user: {
                type: 'nested',
                properties: {
                  id: { type: 'long' },
                  email: { type: 'text' },
                  nickname: { type: 'text' },
                },
              },
            },
          },
        },
      })
      console.log('Elasticsearch index "comments" created successfully')
    }
  } catch (error) {
    console.error('Error creating Elasticsearch index:', error)
    throw error
  }
}

export { esClient, createIndex }
