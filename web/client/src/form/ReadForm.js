import React from 'react';
import {AxesFields, LabelledRange} from "../elements/AxesFields";
import { Input } from "../elements/LabelledText";
import './ReadForm.css';

export default function ReadForm(props) {
	const data = props.data;
	/* const weightOne = {
		min: data["weightOne-min"],
		max: data["weightOne-max"],
	};
	const size = {
		min: data["size-min"],
		max: data["size-max"],
	};
	const quantity = {
		min: data["quantity-min"],
		max: data["quantity-max"],
	};
	const axes = {
		lcg: {min: data["lcg-min"], max: data["lcg-max"]},
		tcg: {min: data["tcg-min"], max: data["tcg-max"]},
		vcg: {min: data["vcg-min"], max: data["vcg-max"]},
		lm: {min: data["lm-min"], max: data["lm-max"]},
		tm: {min: data["tm-min"], max: data["tm-max"]},
		vm: {min: data["vm-min"], max: data["vm-max"]},
	} */
	return (
		<form onSubmit={props.onSubmit}>
			<div className="textFields">
				<Input
					name="heading"
					label="Heading:"
					value={data.heading}
					onChange={props.onChange}
				/>
				<Input
					name="specHeading"
					label="Spec Heading:"
					value={data.specHeading}
					onChange={props.onChange}
				/>
				<Input
					name="gcmna"
					label="GCMNA Point Person:"
					value={data.gcmna}
					onChange={props.onChange}
				/>
				<Input
					name="features"
					label="Features (Comma separated):"
					value={data.features}
					onChange={props.onChange}
				/>
				<Input
					name="location"
					label="Location:"
					value={data.location}
					onChange={props.onChange}
				/>
				<Input
					name="category"
					label="Category:"
					value={data.category}
					onChange={props.onChange}
				/>
				<Input
					name="material"
					label="Material / Colour:"
					value={data.material}
					onChange={props.onChange}
				/>
				<Input
					name="manufacturer"
					label="Manufacturer:"
					value={data.manufacturer}
					onChange={props.onChange}
				/>
				<LabelledRange
					name="size"
					label="Size"
					value={data.size}
					onChange={props.onChange}
				/>
				<LabelledRange
					name="weightOne"
					label="Weight Per Unit"
					value={data.weightOne}
					onChange={props.onChange}
				/>
				<LabelledRange
					name="quantity"
					label="Quantity"
					value={data.quantity}
					onChange={props.onChange}
				/>
			</div>

			<AxesFields
				value={data.axes}
				onChange={props.onChange}
			/>
			<input type="submit" value="Submit"/>
		</form>
	);
}