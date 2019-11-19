const Init = require('rethink-table').Init.advanced

const tables = [
    require('./chats'),
    require('./states'),
]

module.exports = function(config) {
    return Init(config, tables)
}