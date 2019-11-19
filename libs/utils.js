exports.envToConfig = function (env) {
  return {
    appid: env.NODE_APPID,
    baseURL: env.BASE_URL,
    rethink: {
      db: env.RETHINK_DB || env.NODE_APPID,
      host: env.RETHINK_HOST,
      password: env.RETHINK_PASSWORD,
      user: env.RETHINK_USER,
      port: env.RETHINK_PORT
    },
    express: {
      sessionSecret: env.EXPRESS_SESSION_SECRET,
      port: env.EXPRESS_PORT
    },
    vgo: {
      ethAddress: env.VGO_ETH_ADDRESS,
      apiKey: env.VGO_API_KEY
    },
    steam: {
      returnURL: env.STEAMAUTH_RETURN_URL,
      realm: env.STEAMAUTH_REALM,
      apiKey: env.STEAMAUTH_API_KEY
    }
  }
}