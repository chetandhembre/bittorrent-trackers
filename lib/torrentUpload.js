var uploadElement = require('upload-element')



module.exports = function handleUploadTorrent(element, callback) {
	uploadElement(element, function (err, files) {

		return callback(err, files[0].file)
	})	
}

