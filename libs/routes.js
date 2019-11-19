const assert = require('assert')
const lodash = require('lodash')

module.exports = (config, libs) => {
  assert(config, 'config required')

  const ADMINS = [
    '76561198403312375'
  ]

  libs.express.get('/', (req, res, next) => {
    res.send(`${config.appid} api`)
  })

  libs.express.get('/healthCheck', (req, res, next) => {
    res.send({
      status: 'online'
    })
  })

  // AUTHENTICATION

  libs.express.get('/auth', libs.express.passport.authenticate('steam'))

  // steam callback endpoint
  libs.express.get('/auth/completed', libs.express.passport.authenticate('steam', {
    failureRedirect: '/auth',
    successRedirect: config.baseURL || '/userData',
  }))

  libs.express.get('/logout', (req, res) => {
    req.session.destroy()
    res.send("session destroyed!")
  })
  
  // VGO API

  libs.express.get('/userData', (req, res, next) => {
    if (!req.session.passport) return next(new Error('user not authenticated'))
    return res.send({
      user: req.session.passport.user
    })
  })

  libs.express.get('/getKeyCount', async (req, res, next) => {
    if (!req.session.passport) return next(new Error('user not authenticated'))
    const keyCount = await libs.vgoAPI.getKeyCount(req.session.passport.user.id)
    return res.send({
      keyCount
    })
  })

  libs.express.get('/getCaseSchema', async (req, res, next) => {
    const cases = await libs.vgoAPI.getCases(req.connection.remoteAddress)
    res.send({
      cases
    })
  })

  libs.express.get('/getItems', async (req, res, next) => {
    if (!req.session.passport) return next(new Error('user not authenticated'))
    const items = await libs.vgoAPI.getItems(req.session.passport.user.id, req.query.items)
    return res.send({
      items
    })
  })

  libs.express.get('/sendCaseOpenOffer', async (req, res, next) => {
    if (!req.session.passport) return next(new Error('user not authenticated'))
    if (!req.query.case_id || !req.query.amount) return next(new Error('Invalid case open parameters'))
    libs.vgoAPI.openCase(
      req.session.passport.user.id,
      req.query.case_id,
      req.query.amount,
    ).then(result => {
      return res.send(result)
    }).catch(next)
  })

  libs.express.get('/openOfferState', async (req, res, next) => {
    if (!req.session.passport) return next(new Error('user not authenticated'))
    if (!req.query.offer_id) return next(new Error('No offer id provided'))
    const result = await libs.vgoAPI.openOfferState(req.session.passport.user.id, req.query.offer_id)
    return res.send(result)
  })

  // STATE

  libs.express.get('/getServerState', async (req, res, next) => {
    var state = libs.state()
    res.send(state)
  })

  libs.express.get('/getStats', async (req, res, next) => {
    var state = libs.stats()
    res.send(state)
  })

  // libs.express.get('/addFakeBox', async (req, res, next) => {
  //   if (!lodash.includes(ADMINS, req.session.passport.user.id)) return next(new Error('user is not admin'))
  //   var state = libs.stats.updateCaseStats({"case_id":2,"case_site_trade_offer_id":1414887,"created":1532467446477,"done":false,"id":691226,"item":{"category":"Mil-Spec Pistol","color":"#4b69ff","eth_inspect":null,"id":2047534,"image":{"300px":"https://files.opskins.media/file/vgo-img/item/glock-18-ancestral-battle-scarred-300.png","600px":"https://files.opskins.media/file/vgo-img/item/glock-18-ancestral-battle-scarred-600.png"},"inspect":null,"internal_app_id":1,"name":"Glock-18 | Ancestral (Battle-Scarred)","paint_index":null,"pattern_index":591,"preview_urls":{"back_image":"https://files.opskins.media/file/vgo-img/previews/1621338_back.jpg","front_image":"https://files.opskins.media/file/vgo-img/previews/1621338_front.jpg","thumb_image":"https://files.opskins.media/file/vgo-img/previews/1621313_thumb.jpg","video":"https://files.opskins.media/file/vgo-img/previews/1621338_video.webm"},"rarity":"Mil-Spec","sku":133,"suggested_price":57,"suggested_price_floor":57,"trade_hold_expires":null,"type":"Pistol","wear":0.96676337718964},"status":3,"status_text":"Opened","updated":1532467446478,"user":{"avatarurl":"https://steamcdn-a.opskins.media/steamcommunity/public/images/avatars/57/573f45615e0fe0e8dcbcd835538fa404994f5529.jpg","id":"2abfb8b2-53ba-4509-9eee-e0b761f30fc8","steamid":"76561198403312375","username":"tacyarg"},"userid":"2abfb8b2-53ba-4509-9eee-e0b761f30fc8"})
  //   res.send(state)
  // })

  // CHAT

  libs.express.get('/removeMessage', async (req, res, next) => {
    if (!req.session.passport) return next(new Error('user not authenticated'))
    if (!req.query.messageid) return next(new Error('No messageid provided'))
    if (!lodash.includes(ADMINS, req.session.passport.user.id)) return next(new Error('user is not admin'))
    return libs.chats.removeMessage(req.query.messageid, req.query.roomid).then(result => {
      return res.send(result)
    }).catch(next)
  })

  libs.express.get('/sendChatMessage', async (req, res, next) => {
    if (!req.session.passport) return next(new Error('user not authenticated'))
    return libs.chats.speak(req.query.message, {
      id: req.session.passport.user.id,
      avatarurl: req.session.passport.user._json.avatar,
      username: req.session.passport.user.displayName
    }, req.query.roomid).then(message => {
      return res.send(message)
    }).catch(next)
  })

  // 404 error handle
  libs.express.use(function (req, res, next) {
    next(new Error('Invalid Request'))
  })

  libs.express.use(function (err, req, res, next) {
    res.status(500).send(err.message || err)
  })
}