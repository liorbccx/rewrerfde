const assert = require('assert')
const Promise = require('bluebird')
const express = require('express');
const sharedSesh = require('express-socket.io-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4')

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const SteamStrategy = require('passport-steam');

function SteamPassport(config) {
  // assert(config.returnURL, 'requires config.returnURL')
  assert(config.realm, 'requires config.realm')
  assert(config.apiKey, 'requires config.apiKey')

  config.returnURL = (config.returnURL || config.realm) + '/auth/completed'
  
  return new SteamStrategy(config, ((identifier, profile, done) => {
    return done(null, profile);
  }))
}

const session = require('express-session');

function Session(config) {
  // assert(config.sessionSecret, 'requires config.sessionSecret')
  return session({
    secret: config.sessionSecret || uuid(),
    resave: true,
    saveUninitialized: true,
  })
}

module.exports = function (config) {
  assert(config, 'requires config')
  assert(config.express, 'requires config.express')
  assert(config.steam, 'requires express .steam')

  const session = Session(config.express)
  const steamPassport = SteamPassport(config.steam)

  io.use(sharedSesh(session))
  app.use(session)
  app.use(bodyParser.json())
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(steamPassport)
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((obj, done) => done(null, obj))
  app.passport = passport
  app.io = io

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS')
    next()
  })

  return Promise.fromCallback(done => {
    server.listen(config.express.port, done)
  }).then(function(){
    return app
  })
}