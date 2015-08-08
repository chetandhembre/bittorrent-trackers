var L = require('leaflet')
var createMap = require('leaflet-map')

function leafletDefault(opts) {
  opts = opts || {}
  var map = createMap()
  map.setView([0,0], 2)

  if(!(opts.tiles === false)) {
    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
  }
  
  return map
}

var map = leafletDefault()

function addToMap(lat, long) {
	var marker = L.marker([lat,long])
  					.bindPopup('Null Island!')
	
	marker.addTo(map)
}

function reset () {
	map.remove()
	map = leafletDefault()
}
module.exports = {
	addToMap : addToMap,
	reset: reset
}
