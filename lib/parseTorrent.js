var pTorrent = require('parse-torrent')

function parseTorrent(data) {
	return pTorrent(data)
}

function parseRemoteTorrent(url, callback) {
	pTorrent.remote(url, callback)
}


module.exports = {
	parseTorrent : parseTorrent,
	parseRemoteTorrent: parseRemoteTorrent
}