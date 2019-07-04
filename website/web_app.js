const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const mongo = require('mongodb').MongoClient

const url = 'mongodb://localhost:27040'

app.get('/', (req, res) => 
	res.sendFile(__dirname + "/client/index.html")
)
app.post('/', (req, res) => { 
	mongo.connect(url, (err, client) => {
		if (err) {
			console.error(err)
			return
		}
		const db = client.db('school')
		const collection = db.collection('students')
		collection.find({name: req.body.filter}).toArray((err, items) => {
			console.log(items)
		})
		client.close()
	})
	res.redirect('back')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))