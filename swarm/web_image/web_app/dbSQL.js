const mysql = require('mysql');
const connection = mysql.createConnection({
	host:     process.env.MYSQL_host,
	user:     process.env.MYSQL_user,
	password: process.env.MYSQL_password,
	database: process.env.MYSQL_database,
});

/*
SQL CSV Columns:
Heading
Spec_Heading
Features
GCMNA Point Person
Builder  ID Number
Location
Category
Electrical
Preferred MFG
Model
Hyperlink
Weight Per Unit (LBS)
Quantity
LCG
TCG
VCG
Longitudinal Moment
Transverse Moment (Port is Neg.)
Vertical Moment
Material_And_Color
Size
*/

/*
Heading: '',
Spec_Heading: '',
Sorting_Nature_of_Info_Produced: "",
Features: "",
Model: "",
Hyperlink: "",
Source: "",
Material_And_Color: "",
Size: {min: -1, max: -1},
Weight_Per_Unit: {min: -1, max: -1},
Quantity: {min: -1, max: -1},
axes: {
	lcg: {min: -1, max: -1},
	tcg: {min: -1, max: -1},
	vcg: {min: -1, max: -1},
	lm: {min: -1, max: -1},
	tm: {min: -1, max: -1},
	vm: {min: -1, max: -1},
}
req.mode can be "read" or "write"
req.source can be "parts" or "boats". Former is for generic parts DB, latter for boatParts.
*/
const nameTables = [ // Just name and ID
	{ table: "headings", heading: "Heading" },
	{ table: "personnel", heading: "GCMNA_Point_Person" },
	{ table: "locations", heading: "Location" },
	{ table: "categories", heading: "Category" },
	{ table: "materials", heading: "Material_And_Color" },
	{ table: "manufacturers", heading: "Preferred_MFG" },
];
let tableData = { // We fill up this object during CSV read
	headings: new Map(),
	specHeadings: new Map(),
	personnel: new Map(),
	materials: new Map(),
	manufacturers: new Map(),
	locations: new Map(),
	features: new Map(),
	categories: new Map(),
	parts: new Map(),
	boats: new Map(),
	boatParts: new Map(),
	boatPartMeta: new Map(),
	boatPartFeatures: new Map(),
};
const insert = function (table, values) {
	if (table === 'features') return;

	let fields;
	if (table === 'specHeadings') {
		return;
		fields = "heading, name";
	} else {
		fields = "name";
	}

	let sql = `INSERT INTO ${table} (${fields}) VALUES `;
	values.forEach(row => {
		if (table === 'specHeadings') {
			sql += mysql.format("(?, ?), ", [row.heading, row.name]);
		} else {
			sql += mysql.format("(?), ", [row.name]);
		}
	});
	sql = sql.slice(0, -2);
	connection.query(sql, (err, res, fields) => {
		// console.log(`Attempt write to ${table}`);
		// console.log(sql);
		if (err) throw err;
		console.log(`Wrote to table \`${table}\``);
	});

};

const insertSpecHeadings = async() => {
	connection.connect();

	let sql = `INSERT INTO \`specHeadings\` (\`heading\`, \`name\`) VALUES `;
	await tableData.specHeadings.forEach(e => {
		// Get heading index from text
		// quick query to get id from text
		try {
			connection.query({
				sql: "SELECT * FROM headings WHERE name=?",
				values: [e.headingRaw]
			}, (err, results, fields) => {
				if (err) throw err;

				sql += mysql.format("(?, ?), ", [results[0].id, e.name]);
			});
		} catch (error) {
			throw error;
		}
		
	});
	// Now that we've got both heading and name, we can run insert
	// sql = sql.slice(0, -2);
	connection.query(sql.slice(0, -2), (err, res, fields) => {
		// console.log(`Attempt write to ${table}`);
		console.log(sql.slice(0, -2));
		if (err) throw err;
		console.log(`Wrote to table \`specHeadings\``);
	});

	connection.end();
	return JSON.stringify(tableData.specHeadings);
};

const runInsert = async () => {
	// 2. For specHeading
	tableData.specHeadings.forEach(e => {
		e.heading = tableData.headings.findIndex(x => x.name === e.headingRaw);
	});
	connection.connect();
	// 3. Connect to DB and insert
	for (var t in tableData){
		if (tableData.hasOwnProperty(t)) {
			try {
				// console.log(t, tableData[t]);
				await insert(t, tableData[t]);
			} catch (error) {
				console.log(error)
			}
		}
	}
	connection.end();
	return JSON.stringify(tableData);
}
/**
 * Primary handler for front end requests.
 * @param {object} req Input object. JSON data is in req.body
 * @param {object} res Output. Make sure to write any output into res.json
 */
const handle_req = (req, res) => {
	const json = req.body;
	if (json.mode == "read") {
		//TODO: read
		// If a field is present and has a valid value (not empty for strings and >=0 for ints) then its used to filter output
		// Output:
		/*
		0: Heading
		1: Spec_Heading
		2: Sorting_Nature_of_Info_Produced
		3: Features
		4: Model
		5: Hyperlink
		6: Source
		7: Weight_Per_Unit
		8: Quantity
		9: LCG
		10: TCG
		11: VCG
		12: Longitudinal_Moment
		13: Transverse_Moment
		14: Vertical_Moment
		15: Material_And_Color
		16: Size
		*/
		let query; // This will contain our query!
		connection.query("SELECT * FROM parts", (err, rows, fields) => {
			if (err) throw err;
			res.json({...rows});
			// res.json({"success": true});
		});
	} else if (json.mode == "write") {
		//TODO: write
	} else {
		res.json({
			success: false,
			error: "Invalid mode",
		});
		return;
	}
	// res.json({ ...req.body });
};

module.exports = {
	handle_req
}