const userQueries = require('./userQueries')
const commentQueries = require('./commentQueries')

module.exports = `
  ${userQueries}
  ${commentQueries}
`
