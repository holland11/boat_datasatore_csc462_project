


const mysql = require('mysql');
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'boatdb'
});
const tables = {
	headings: "Heading",
	specHeadings: "Spec Heading",
	features: "Features",
	personnel: "GCMNA Point Person",
	locations: "Location",
	categories: "Category",
	materials: "Material / Color",
	manufacturers: "Preferred MFG",
};
let tableData = {
	headings: [],
	specHeadings: [],
	personnel: [],
	materials: [],
	manufacturers: [],
	locations: [],
	features: [],
	categories: []
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


exports.insertSpecHeadings = async() => {
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

exports.runInsert = async () => {
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

exports.csvRead = (row) => {
	// 1. Create unique list of fields
	let val;
	for (var t in tables){
		if (tables.hasOwnProperty(t)) {
			val = tables[t];
			
			if (!tableData[t].find(x => x.name === row[tables[t]])) {
				// New entry
				if (t == "specHeadings") {
					tableData[t].push({
						name: row[tables[t]],
						headingRaw: row["Heading"],
					});
				} else {
					tableData[t].push({
						name: row[tables[t]],
					});
				}
			}
		}
	}
};

exports.handle_req = (req, res) => {
	res.json({
		response: "success"
	});
};