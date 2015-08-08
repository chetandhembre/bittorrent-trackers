module.exports = {
	getTrackers : getTrackers
}

var UdpTracker = require('bittorrent-udp-tracker')

function handleGetTrackerCallback(udpTracker, callback) {
	var isCalled = false
	return function (err, res) {
		if (isCalled) {
			return 
		}
		isCalled = true
		udpTracker.destory()
		return callback(err, res)
	}
}

function getTrackers (infoHash, announce, callback) {
	var udpTracker = new UdpTracker(new Buffer('01234567890123456789'), infoHash, announce)
	
	callback = handleGetTrackerCallback(udpTracker, callback)
	
	udpTracker.announce(2, {
	  downloaded: 0,
	  left: 0,
	  uploaded: 0
	})
	 
	udpTracker.once('error', function (err) {
	  return callback(new Error(err))
	})
	 
	udpTracker.once('update', function (msg) {
	  return callback(null, msg['peers'])
	})

	setTimeout(function () {
		return callback(new Error('timeout while getting peers'))
	}, 15000)
}