const commentMutations = require('./commentMutations')
const userMutations = require('./userMutations')

module.exports = `
  ${commentMutations}
  ${userMutations}
`
