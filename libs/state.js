const State = require('statesync')
const lodash = require('lodash')

module.exports = function (libs) {
    return libs.states.get('state').catch(err => {
        return {
            id: 'state',
            chats: libs.chats(),
            stats: libs.stats()
        }
    }).then(state => {
        state = State(state, lodash.cloneDeep)

        var chats = state.scope('chats')
        libs.chats.on('diff', chats.patch)

        var stats = state.scope('stats')
        libs.stats.on('diff', stats.patch)

        // listen to offers and create top 10 case lsit.
        libs.vgoAPI.on('openOfferState', response => {
            if (response.offer.state !== 3) return
            var ready = (response.cases.length === response.offer.recipient.items.length) ? lodash.every(response.cases, ['status', 3]) : false
            if (!ready) return
            var user = {
                avatar: response.offer.recipient.avatar,
                username: response.offer.recipient.display_name,
                steamid: response.offer.recipient.steam_id
            }
            lodash.each(response.cases, box => {
                box.user = user
                return libs.stats.updateCaseStats(box)
            })
        })

        // upsert state changes
        state.on('change', change => {
            libs.states.upsert(state())
        })

        return state
    })
}