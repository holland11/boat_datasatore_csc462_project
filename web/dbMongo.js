const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
},
{
	timestamps: true
})

const boatPartSchema({
	BoatID: String,
	PartID: String,
	Quantity: Number
})

const Part = mongoose.model('parts', partSchema)

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

module.exports = {
	handle_req: function(req, res) {
		console.log("in mongodb")
		console.log(req.body.args)
		parsed_query = parse_query(req.body.args)
		console.log(parsed_query)
		read = req.body.mode == 'read'
		
		if (!mongoose.connection.db) {
			// mongoose didn't have an initial connection so we need to try again
			mongoose.connect('mongodb://mongos0:27017/boat', {useNewUrlParser: true});
		}
		
		if (read) {
			Part.find(parsed_query, (err, foundParts) => {
				if (err) {
					res.send({
						success: false,
						err
					})
				} else {
					console.log("read:")
					console.log(foundParts)
					res.send({
						success: true,
						parts: foundParts
					})
				}
			})
		} else { // write
			if (parsed_query._id) {
				// if they provide an _id, then it's probably an update request
				Part.findOne({_id: parsed_query._id}, (err, foundPart) => {
					if (err) {
						console.log(err)
						console.log("error searching for part with provided _id")
						res.send({ success: false, err })
					} else {
						let newPart = new Part()
						if (foundPart) newPart = foundPart;
						for (key in parsed_query) {
							newPart[key] = parsed_query[key]
						}
						newPart.save().then(result => {
							console.log("wrote:")
							console.log(result)
							res.send({
								success: true,
								part: result
							})
						})
					}
				})
			} else {
				let newPart = new Part(parsed_query)
				newPart.save().then(result => {
					console.log("wrote:")
					console.log(result)
					res.send({
						success: true,
						part: result
					})
				})
			}
		}
	}
}