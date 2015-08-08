var Hapi = require('hapi')
var udpTracker = require('../lib/udpTracker')

var server = new Hapi.Server();
server.connection({ 
    port: process.env.PORT || 5000 
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'client'
        }
    }
});

server.route({
	method: 'GET',
	path: '/api/announce',
	handler: function (request, reply) {
		var infoHash = request.query['infoHash']
		var announce = request.query['announce']
		var ips = []
		if (isUdp(announce)) {
			udpTracker.getTrackers(infoHash, announce, function (err, res) {
				if (err) {
					return reply(err)
				}

				return reply(res)
			})
		} else {
			return reply(ips) 	
		}

		
	}
})

function isUdp (url) {
	return url.indexOf('udp:') === 0
}


// Start the server
server.start();