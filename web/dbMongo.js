const mongo = require('mongodb').MongoClient

const url = 'mongodb://localhost:27040'

module.exports = {
	handle_req: function(req, res) {
		console.log("mongodb")
		console.log(req.body)
		mongo.connect(url, (err, client) => {
			if (err) {
				console.error(err)
				return
			}
			const db = client.db('school')
			const collection = db.collection('students')
			collection.find({Heading: req.body.Heading}).toArray((err, items) => {
				console.log(items)
			})
			client.close()
		})
	}
}