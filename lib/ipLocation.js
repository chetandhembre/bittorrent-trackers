var ipRegex = require('ip-regex')
var httpClient = require('./httpClient')

module.exports = function (ip, callback) {
  ip = ip.split(':')[0]	
  if (!ipRegex().test(ip)) {
    return callback('Invalid IP address.', null)
  }
  return httpClient.get('https://freegeoip.net/json/' + ip, function (err, response, body) {
    var json
    try {
      json = JSON.parse(body)
    } catch (ex) {
      return callback(ex, null)
    }
    return callback(err, json['latitude'], json['longitude'])
  })
}