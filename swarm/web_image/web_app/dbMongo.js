const mongo = require('mongodb').MongoClient

const url = 'mongodb://mongos0:27017'

parse_query = (args) => {
	return args
};

module.exports = {
	handle_req: function(req, res) {
		console.log("in mongodb")
		console.log(req.body)
		parsed_query = parse_query(req.body.args)
		read = req.body.mode == 'read'
		mongo.connect(url, (err, client) => {
			if (err) {
				console.error(err)
				console.log("error connecting to mongo")
				return
			}
			const db = client.db('boat')
			const collection = db.collection('parts')
			collection.find({Heading: req.body.Heading}).toArray((err, items) => {
				console.log(items)
			})
			console.log("query complete")
			client.close()
		})
	}
}