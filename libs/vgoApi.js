const Axios = require('axios');
const { EventEmitter } = require('events');
const lodash = require('lodash')

function logRequest(requestee, dataRequested) {
  console.log(`${new Date().toUTCString()} | ${requestee} requested ${dataRequested}`);
}

class VGOApi extends EventEmitter {
  constructor(apiKey, ethereumAddress) {
    super();
    this.apiKey = apiKey;
    this.ethAddress = ethereumAddress;
    this.Axios = Axios.create({
      baseURL: 'https://api-trade.opskins.com',
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
    });
  }

  async getCases(remoteAddress) {
    const response = await this.Axios.get('/ICase/GetCaseSchema/v1');
    logRequest(remoteAddress, 'caseSchemas');
    return response.data.response.cases;
  }

  async getKeyCount(steamId) {
    const response = await this.Axios.get('/ICaseSite/GetKeyCount/v1', { params: { steam_id: steamId } });
    logRequest(steamId, 'keyCount');
    return response.data.response.key_count;
  }

  async getItems(steamId, items) {
    const response = await this.Axios.get('/IItem/GetItems/v1/', { params: { sku_filter: items } });
    logRequest(steamId, 'getItems');
    return response.data.response.items;
  }

  openCase(steamId, caseId, amount) {
    console.log(steamId, caseId, amount)
    return this.Axios.post('/ICaseSite/SendKeyRequest/v1', {
      steam_id: steamId,
      case_id: caseId,
      affiliate_eth_address: this.ethAddress,
      amount,
    }).then(response => {
      return response.data.response
    })
  }

  async openOfferState(steamId, offerId) {
    const response = await this.Axios.get('/ICaseSite/GetTradeStatus/v1', { params: { offer_id: offerId } });
    logRequest(steamId, 'offerState');
    this.emit('openOfferState', response.data.response)
    return response.data.response;
  }
}

module.exports = VGOApi;
