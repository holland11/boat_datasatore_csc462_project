const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const mongo_api = require('./mongo_funcs')
const mysql_api = require('./mysql_funcs')

app.get('/', (req, res) => 
	res.sendFile(__dirname + "/client/index.html")
)
app.post('/', (req, res) => { 
	if (req.body.db_type == "mongo") {
		mongo_api.handle_req(req, res)
	} else {
		mysql_api.handle_req(req, res)
	}
	res.redirect('back')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))