var express = require('express');
var router = express.Router();

/*
	This route is used to read a CSV at a pre-determined location,
	parse it into sql friendly format,
	then write to DB as necessary.
*/
const csvPath = process.env.CSV_filename || "data.csv";

const csv = require('csv-parser');  
const fs = require('fs');

const dbSQL = require('../dbSQL');
//Object Constructors
function Spec_Heading(name, heading) {
	return {
		name: name,
		heading: heading,
	}
}
function Part(ManufacturerRef, CategoryRef, Model, BuilderID, Electrical, Units, Hyperlink, Source, Weight_Per_Unit, Size) {
	return {
		ManufacturerRef: ManufacturerRef,
		CategoryRef: CategoryRef,
		Model: Model,
		BuilderID: BuilderID,
		Electrical: Electrical,
		Units: Units,
		Hyperlink: Hyperlink,
		Source: Source,
		Weight_Per_Unit: Weight_Per_Unit,
		Size: Size,
	}
}
function BoatPart(BoatRef, PartRef, LocationRef, HeadingRef, Spec_HeadingRef, Quantity, ParentRef, CG, Moment, Material_And_Color ) {
	return {
		BoatRef: BoatRef,
		PartRef: PartRef,
		LocationRef: LocationRef,
		HeadingRef: HeadingRef,
		Spec_HeadingRef: Spec_HeadingRef,
		Quantity: Quantity,
		ParentRef: ParentRef,
		CG: CG,
		Moment: Moment,
		Material_And_Color: Material_And_Color,
	}
}
function BoatPartFeature(BoatPartRef, FeatureRef) {
	return {
		BoatPartRef: BoatPartRef,
		FeatureRef: FeatureRef,
	}
}
let tableData = [ // We fill up this object during CSV read
	{ field:"Heading",         data: new Set() },
	{ field:"Spec_Heading",    data: new Set() },
	{ field:"Material_And_Color", data: new Set() },
	{ field:"Manufacturer",    data: new Set() },
	{ field:"Location",        data: new Set() },
	{ field:"Features",         data: new Set() },
	{ field:"Category",       data: new Set() },
	{ field:"Boat",            data: new Set() },
	{ field:"Part",            data: [] },
	{ field:"BoatPart",        data: [] },
	{ field:"BoatPartFeature", data: [] },
];
/**
 * Read in one line of CSV input data. Steps:
 * 1. Write {Heading, Location, Category, Material_And_Color, GCMNA_Point_Person, Preferred_MFG} if the entry does not exist in DB. In either case, add its ID and name to our state
 * 2. Write {Spec_Heading} if the field is new. Use the saved ref to Heading; obtain ref of this Spec_Heading
 * 3. If {Boat} is specified, either add its ref or create a ref to a new boat. Otherwise, refer to the first extant boat
 * 4. Create a new part in `parts` from {Manf, Model, BuilderID, Electrical, Category, Unit_Measurement, Source, Weight_Per_Unit, Size}. Add PartID to refs
 * 5. Create a new row in `boatparts` from {Boat, Part, Location, GCMNA_Point_Person, Spec_Heading, Quantity, Parent, {CG}, {Moment}, Material_And_Color}
 * 6. Tokenize {Features} and write to `boatpartfeatures` (with ref to boatpart)
 * 7. If there are unprocessed fields, write them to `boatpartmeta`
 * 
 * @param {object} row One row of CSV data (i.e. a part in a boat)
 */
const csvRead = (row) => {
	// Start by mapping my data tables (i.e. not parts)
	tableData.forEach(table => {
		switch (table.field) {
			case "Heading":
			case "Material_And_Color":
			case "Manufacturer":
			case "Category":
			case "Location":
			case "Boat":
				table.data.add(row[table.field]);
				break;
			case "Spec_Heading":
				table.data.add({name: row.Spec_Heading, heading: row.Heading});
				break;
			case "Features":
				const features = row.Features.split(",");
				features.forEach(f => {
					table.data.add(f);
				});
				break;
		}
		// Now we construct the actual row items.
		// We construct both a Part and a BoatPart, Part are in a set while BoatPart are a regular array
	});
	// 1. Create unique list of fields

	// Start by testing the columns in nameTables
	for (var t in nameTables) {
		// Add to data structure if unique, for now.
		const result = tableData[t.table].filter(obj => {
			return obj === row[t.heading];
		});
		if (!result) {
			tableData[t.table].push(row[t.heading]);
		}
	}
	// For Spec_Heading, we do the same, but also include heading
	const sh = tableData.specHeadings.filter(o => o === row.Spec_Heading);
	if (!sh) {
		tableData.specHeadings.push({name: row.Spec_Heading, heading: row.Heading});
	}
	if (row.hasOwnProperty("Boat")) {
		if (!tableData.boats.filter(o => o === row.Boat)) {
			tableData.boats.push()
		}
	}
	for (var t in tables){
		if (tables.hasOwnProperty(t)) {
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
}

router.get('/', function(req, res, next) {
	
	fs.createReadStream(csvPath)
		.pipe(csv())
		.on('data', dbSQL.csvRead)
		.on('end', () => {
			dbSQL.runInsert().then((tableJSON) => {
				res.send(tableJSON);
				dbSQL.insertSpecHeadings().then((specJSON) => {
					res.send(specJSON);
				});
			});
			// res.send("Processing complete");
		});

});
module.exports = router;
