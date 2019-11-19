const Table = require('rethink-table').Table

module.exports = function (con) {
    var schema = {
        table: 'chats',
        indices: ['created']
    }
    return Table(con, schema)
}