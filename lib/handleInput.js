module.exports = {
	TorrentFile : TorrentFile,
	RemoteTorrent: RemoteTorrent
}

var pTorrent = require('../lib/parseTorrent')
var httpClient = require('../lib/httpClient')
var blobToBuffer = require('blob-to-buffer')

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

var parallel = require('run-parallel')
var qs = require('querystring')

var path = require('path')

inherits(TorrentFile, EventEmitter)

function TorrentFile (file) {
  var self = this
  EventEmitter.call(self)
  
  if (!isTorrentFile(file)) {
    throw new Error('file should be torrent file')
  }

  var fileName = file.name
  blobToBuffer(file, function (err, buff) {
    if (err) {

    }
    torrent = pTorrent.parseTorrent(buff)
    var name = document.querySelector('#name')
    name.innerHTML = torrent.name
    getTrackers.bind(self, torrent['infoHash'], torrent['announce'])()
  })
}


inherits(RemoteTorrent, EventEmitter)
function RemoteTorrent(remoteUrl) {
  var self = this
  EventEmitter.call(self)
  self.url = remoteUrl
  
  pTorrent.parseRemoteTorrent(remoteUrl, function (err, torrent) {
  	var name = document.querySelector('#name')
	  name.innerHTML = torrent.name
	  getTrackers.bind(self, torrent['infoHash'], torrent['announce'])()
  })
  
  return self
}


function getTrackers(infoHash, announces) {
	var self = this
	var parallelTask = announces.map(function (announce) {
		return function (cb) {
			setTimeout(function () {
				httpClient.get('/api/announce?' + qs.stringify({
					infoHash: infoHash, 
					announce: announce
				}), function (err, res, body){
					if (err) {
						return cb(err)
					}

					try {
						var ips = JSON.parse(body)	
						self.emit('peers', ips)
					} catch (e) {
						return cb(null)
					}

					return cb (err)
				})	
			}, 2000)
				
		} 
	})

	parallel(parallelTask, function (err, res) {
		if (err) {
			self.emit('error')
		} 

		self.emit('done')
	})

}

function isTorrentFile (file) {
  var extname = path.extname(file.name).toLowerCase()
  return extname === '.torrent'
}