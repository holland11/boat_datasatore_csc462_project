const mongoose = require('mongoose')
const Schema = mongoose.Schema
const csv = require('csv-parser')
const fs = require('fs')

const boatSchema = new Schema({
	Name: String
})

const partSchema = new Schema({
	Heading: String,
	Spec_Heading: String,
	Features: [
		String
	],
	Model: String,
	Hyperlink: String,
	Source: String,
	Weight: mongoose.Decimal128,
	Material_And_Color: String,
	Size: String
})

const boatPartSchema = new Schema({
	BoatID: String,
	PartID: String,
	Quantity: Number
})

const Part = mongoose.model('parts', partSchema)
const Boat = mongoose.model('boats', boatSchema)
const BoatPart = mongoose.model('boat_parts', boatPartSchema)

parse_query = (args) => {
	result = {}
	for (key in args) {
		if (args[key] == "") {
			continue
		}
		if (args[key] && args[key].min && args[key].max) {
			if (args[key].min == -1 && args[key].max == -1) continue
			else {
				// turn Size: { min: -1, max: 23 } into range query
				if (key == "Weight_Per_Unit") {
					result[key] = {
						"$lte": parseFloat(args[key].max),
						"$gte": parseFloat(args[key].min)
					}
				} else {
					result[key] = { 
						"$lte": parseInt(args[key].max),
						"$gte": parseInt(args[key].min)
					}
				}
				continue
			}
		}
		if (key == "axes") {
			// handle the lcg, tcg, vcg, lm, tm, vm fields
			for (axkey in args[key]) {
				if (args[key][axkey].min == -1 && args[key][axkey].max == -1) continue
				name = "LCG"
				if (axkey == "tcg") name = "TCG"
				else if (axkey == "vcg") name = "VCG"
				else if (axkey == "lm") name = "Longitudinal_Moment"
				else if (axkey == "tm") name = "Transverse_Moment"
				else if (axkey == "vm") name = "Vertical_Moment"
				if (axkey == "lcg" || axkey == "tcg" || axkey == "vcg") {
					result[name] = {
						"$lte": parseFloat(args[key][axkey]).max,
						"$gte": parseFloat(args[key][axkey]).min
					}
				} else {
					result[name] = {
						"$lte": parseInt(args[key][axkey]).max,
						"$gte": parseInt(args[key][axkey]).min
					}
				}
			}
			continue
		}
		result[key] = args[key]
	}
	return result
};

massWrite = (count, res) => {
	const data = [];
	
	fs.createReadStream('./trimmed.csv')
		.pipe(csv())
		.on('data', (trimmed) => data.push(trimmed))
		.on('end', () => {
			for (var i=0; i<data.length; i++) {
				const row = data[i];
				row.Features = row.Features.split(','); // convert to a list instead of string
				for (var j=0; j<row.Features.length; j++) {
					row.Features[j] = row.Features[j].trim(); // get rid of leading whitespace
				}
				for (key in row) {
					if (row[key] == "") {
						delete row[key];
					}
				}
			}
			
			num_duplicates = count / data.length;
			num_duplicates = Math.floor(num_duplicates + 0.99); // round up
			console.log("dupes: " + num_duplicates);
			var temp = false;
			for (var i=0; i<num_duplicates; i++) {
				Part.insertMany(data, (err, docs) => {
					if (err) {
						res.send({
							success: false,
							err
						});
						temp = true;
					}
				});
				if (temp) return;
			}
			res.send({
				success: true
			});
		});
};

module.exports = {
	handle_req: function(req, res) {
		//console.log("in mongodb")
		//console.log(req.body.args)
		read = req.body.mode == 'read'
		
		if (!mongoose.connection.db) {
			// mongoose didn't have an initial connection so we need to try again
			mongoose.connect('mongodb://mongos0:27017/boat', {useNewUrlParser: true});
		}
		
		if (req.body.mode == "csvWrite") {
			return massWrite(req.body.count, res);
		}
		
		if (read) {
			Part.find(req.body.args, (err, foundParts) => {
				if (err) {
					res.send({
						success: false,
						message: "Error while trying to find the part in MongoDB.",
						err
					})
				} else {
					//console.log("read:")
					//console.log(foundParts)
					res.send(foundParts)
				}
			})
		} else { // write
			if (req.body.args._id) {
				// if they provide an _id, then it's probably an update request
				Part.findOne({_id: req.body.args._id}, (err, foundPart) => {
					if (err) {
						console.log(err)
						console.log("error searching for part with provided _id")
						res.send({ success: false, err })
					} else {
						let newPart = new Part()
						if (foundPart) newPart = foundPart;
						for (key in req.body.args) {
							newPart[key] = req.body.args[key]
						}
						newPart.save().then(result => {
							//console.log("wrote:")
							//console.log(result)
							res.send({
								success: true,
								part: result
							})
						})
					}
				})
			} else {
				let newPart = new Part(req.body.args)
				newPart.save().then(result => {
					//console.log("wrote:")
					//console.log(result)
					res.send({
						success: true,
						part: result
					})
				})
			}
		}
	}
}