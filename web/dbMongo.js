const mongoose = require('mongoose')
const Schema = mongoose.Schema

const partSchema = new Schema(
	{
		Heading: String,
		Spec_Heading: String,
		Sorting_Nature_of_Info_Produced: {type: String, default: "Spec Item"},
		Features: [
			String
		],
		Model: String,
		Hyperlink: String,
		Source: String,
		Weight_Per_Unit: mongoose.Decimal128,
		Quantity: Number,
		LCG: mongoose.Decimal128,
		TCG: mongoose.Decimal128,
		VCG: mongoose.Decimal128,
		Longitudinal_Moment: Number,
		Transverse_Moment: Number,
		Vertical_Moment: Number,
		Material_And_Color: String,
		Size: String
	},
	{
		timestamps: true
	}
)

const Part = mongoose.model('parts', partSchema)

parse_query = (args) => {
	result = {}
	for (key in args) {
		if (args[key] == "") {
			continue
		}
		if (args[key] && args[key].min) {
			if (args[key].min == -1 && args[key].max == -1) {
				continue
			} else {
				// turn Size: { min: -1, max: 23 } into range query
				continue
			}
		}
		if (key == "axes") {
			// handle the lcg, tcg, vcg, lm, tm, vm fields
			
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
					res.send({
						success: true,
						parts: foundParts
					})
				}
			})
		} else { // write
			if (parsed_query._id) {
				// if they provide an _id, then it's probably an update request
			} else {
				let newPart = new Part(parsed_query)
				newPart.save().then(result => res.send({
					success: true,
					result: result
				}))
			}
		}
	}
}