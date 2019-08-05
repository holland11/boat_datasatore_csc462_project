var express = require('express');
var router = express.Router();


const dbSQL = require('../dbSQL');
const dbMongo = require('../dbMongo');

router.post('/test/', (req, res, next) => {
	console.log(req.body)
	res.send(req.body)
})
router.post('/:mode/:db/part/', (req, res, next) => {
	var new_req = {
		body: {
			mode: req.params.mode,
			args: req.body
		}
	};
	if (req.params.mode != "read" && req.params.mode != "write") {
		res.send({
			success: false,
			err: "Incorrect mode field. Must be 'read', or 'write'.\n/:mode/:db/part/"
		});
	} else if (req.params.db == "mongo") {
		dbMongo.handle_req(new_req, res);
	} else if (req.params.db == "sql") {
		dbSQL.handle_req(new_req, res);
	} else {
		res.send({
			success: false,
			err: "Incorrect db field. Must be 'mongo', or 'sql'.\n/api/:mode/:db/part/"
		});
	}
})
router.post('/:mode/:db/boat/', (req, res, next) => {
	var new_req = {
		body: {
			mode: req.params.mode,
			args: req.body
		}
	};
	if (req.params.mode != "read" && req.params.mode != "write") {
		res.send({
			success: false,
			err: "Incorrect mode field. Must be 'read', or 'write'.\n/api/:mode/:db/boatPart/"
		});
	} else if (req.params.db == "mongo") {
		dbMongo.handle_req(new_req, res);
	} else if (req.params.db == "sql") {
		dbSQL.handle_req(new_req, res);
	} else {
		res.send({
			success: false,
			err: "Incorrect db field. Must be 'mongo', or 'sql'.\n/api/:mode/:db/boatPart/"
		});
	}
})
router.post('/:mode/:db/boatPart/', (req, res, next) => {
	var new_req = {
		body: {
			mode: req.params.mode,
			args: req.body
		}
	};
	if (req.params.mode != "read" && req.params.mode != "write") {
		res.send({
			success: false,
			err: "Incorrect mode field. Must be 'read', or 'write'.\n/api/:mode/:db/boatPart/"
		});
	} else if (req.params.db == "mongo") {
		dbMongo.handle_req(new_req, res);
	} else if (req.params.db == "sql") {
		dbSQL.handle_req(new_req, res);
	} else {
		res.send({
			success: false,
			err: "Incorrect db field. Must be 'mongo', or 'sql'.\n/api/:mode/:db/boatPart/"
		});
	}
})
module.exports = router;
