const Table = require('rethink-table').Table
const lodash = require('lodash')
const Emitter = require('events')
const assert = require('assert')

module.exports = function (con) {
    var schema = {
        table: 'states'
    }

    function defaults(offer) {
        return lodash.defaults(offer, {
            created: Date.now(),
            updated: Date.now()
        })
    }

    return Table(con, schema)
}