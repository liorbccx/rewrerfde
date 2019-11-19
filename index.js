require('dotenv').config()
const utils = require('./libs/utils')
const config = utils.envToConfig(process.env)
const Promise = require('bluebird')

const Database = require('./libs/rethink')
const Express = require('./libs/express')
const VGOApi = require('./libs/vgoApi')

const Routes = require('./libs/routes')
const Sockets = require('./libs/sockets')
const Chats = require('./libs/chats')
const State = require('./libs/state')
const Stats = require('./libs/stats')

Database(config.rethink).then(tables => {
  tables.config = config
  tables.vgoAPI = new VGOApi(config.vgo.apiKey, config.vgo.ethAddress)
  tables.express = Express(config)
  tables.chats = Chats(tables.chats.readStream(), tables.chats.upsert, tables.chats.delete)
  return Promise.props(tables)
}).then(libs => {
  libs.stats = Stats(libs)
  return Promise.props(libs)
}).then(libs => {
  libs.state = State(libs)
  return Promise.props(libs)
}).then(libs => {
  return [
    Routes(config, libs),
    Sockets(config, libs)
  ]
}).spread(function(state, routes, sockets){
  console.log(`Started server: http://localhost:${config.express.port}`)
})