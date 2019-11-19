const lodash = require('lodash')
const moment = require('moment')
const State = require('statesync')

module.exports = function (libs) {
  var state = State({}, lodash.cloneDeep)

  function defaults(props) {
    return lodash.defaults(props, {
      id: 'stats',
      top: defaultLeaderboards(),
      cases: {
        'today': defaultDaily(),
        'allTime': defaultAllTime()
      }
    })
  }

  function defaultAllTime(props) {
    return lodash.defaults(props, {
      opened: 0,
      totalValue: 0
    })
  }

  function defaultDaily(props) {
    return lodash.defaults(props, {
      start: moment().startOf('day').valueOf(),
      end: moment().endOf('day').valueOf(),
      opened: 0,
      totalValue: 0
    })
  }

  function defaultLeaderboards(props) {
    return lodash.defaults(props, {
      limit: 25,
      cases: []
    })
  }

  function processCaseLeaderboard(box) {
    // push new value
    // sort array
    // slice with limit
    var limit = state(['top', 'limit'])
    var topCases = state(['top', 'cases'])
    topCases.push(box)
    topCases = lodash.uniqBy(topCases, 'id')
    topCases = lodash.orderBy(topCases, row => {
      return row.item.suggested_price
    }, ['desc'])
    topCases = lodash.slice(topCases, 0, limit)
    state.set(['top', 'cases'], topCases)
    return state
  }

  function processAllTimeCaseStats(box) {
    var caseStats = state('cases.allTime')
    caseStats.opened += 1
    caseStats.totalValue += (box.item.suggested_price / 100)
    state.set('cases.allTime', caseStats)
    return state('cases.allTime')
  }

  function processDailyCaseStats(box) {
    var caseStats = state('cases.today')
    if (Date.now() > caseStats.end) {
      caseStats = defaultDaily()
    }
    caseStats.opened += 1
    caseStats.totalValue += (box.item.suggested_price / 100)
    state.set('cases.today', caseStats)
    return state('cases.today')
  }

  state.updateCaseStats = function (box) {
    processCaseLeaderboard(box)
    processAllTimeCaseStats(box)
    processDailyCaseStats(box)
    return state()
  }

  function init() {
    return libs.states.get('stats')
      .catch(err => defaults())
      .then(savedState => {

        lodash.each(lodash.keys(savedState), key => {
          state.set(key, savedState[key])
        })

        state.on('change', change => {
          libs.states.upsert(state())
        })

        return state
      })
  }

  return init()
}