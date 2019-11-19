const assert = require('assert')

module.exports = (config, libs) => {
  assert(config, 'config required')
  
  libs.state.on('diff', changes => {
    libs.express.io.emit('diff', changes)
  })

  libs.express.io.on('connection', (socket) => {
    console.log("socket connection!")
  });
};
