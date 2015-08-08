var torrentUpload = require('../lib/torrentUpload')
var enterInput = require('enter-input')
var handleInput= require('../lib/handleInput')
var TorrentFile = handleInput.TorrentFile
var RemoteTorrent = handleInput.RemoteTorrent
var ipLocation = require('../lib/ipLocation')
var gmap = require('../lib/gmap')

var fileElement = document.querySelector('#file')
var magnetLink = document.querySelector('#magnetlink')

function onPeers (peers) {
  peers.slice(0, 10).forEach(function (peer) {
    setTimeout(function () {
      ipLocation(peer, function (err, lat, lng) {
        if(!err) {
          mapIt(lat, lng)
        }
      })  
    }, 2000)
    
  })
}

function mapIt (lat, lng) {
  gmap.addToMap(lat, lng)
}

var remoteTorrent = new RemoteTorrent(document.location.href+'VODO_Haphead_bundle.torrent')
remoteTorrent.once('error', function() {
  remoteTorrent.removeListener('peers', onPeers)
})
remoteTorrent.on('peers', onPeers)
remoteTorrent.once('done', function () {
  remoteTorrent.removeListener('peers', onPeers)
})

torrentUpload(fileElement, function (err, file) {
  if (err) {
    throw err
  }

  remoteTorrent.removeListener('peers', onPeers)
  gmap.reset()
  var torrentFile = new TorrentFile(file)
  torrentFile.once('error', function() {
    torrentFile.removeListener('peers', onPeers)
  })
  torrentFile.on('peers', onPeers)
  torrentFile.once('done', function () {
    torrentFile.removeListener('peers', onPeers)
  })
})








