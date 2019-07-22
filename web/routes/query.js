var express = require('express');
var router = express.Router();

/*
	Here is where we send to mongo or sql, as appropriate
*/

const csv = require('csv-parser');  
const fs = require('fs');

const dbSQL = require('../dbSQL');
const dbMongo = require('../dbMongo');



/* router.get('/', function(req, res, next) {
	
	fs.createReadStream(csvPath)
		.pipe(csv())
		.on('data', customSQL.csvRead)
		.on('end', () => {
			customSQL.runInsert().then((tableJSON) => {
				res.send(tableJSON);
				customSQL.insertSpecHeadings().then((specJSON) => {
					res.send(specJSON);
				});
			});
			// res.send("Processing complete");
		});

}); */


router.post('/', (req, res, next) => {
	console.log(JSON.stringify(req.body));
	if (req.body.source === 'sql' || req.body.source === 'both') {
		dbSQL.handle_req(req, res);
	}
	if (req.body.source === 'mongo' || req.body.source === 'both') {
		dbMongo.handle_req(req, res);
	}
})
module.exports = router;
