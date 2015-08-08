var xhr = require('xhr')

var post = function post(uri, body, callback) {
	xhr({
		uri : uri,
		body: body,
		method: 'POST',
		header : {
			'Access-Control-Allow-Origin' : '*'
		}
	}, callback)
}

var get = function (uri, callback) {
	return xhr({
		uri : uri,
		method: 'GET'
	}, callback)	
}
 
module.exports = {
	post : post,
	get :  get
}