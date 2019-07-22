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
					name="Heading"
					label="Heading:"
					value={data.Heading}
					onChange={props.onChange}
				/>
				<Input
					name="Spec_Heading"
					label="Spec Heading:"
					value={data.Spec_Heading}
					onChange={props.onChange}
				/>
				<Input
					name="Sorting_Nature_of_Info_Produced"
					label="Sorting Nature of Info Produced ('Spec Item' for part):"
					value={data.Sorting_Nature_of_Info_Produced}
					onChange={props.onChange}
				/>
				<Input
					name="Features"
					label="Features (Comma separated):"
					value={data.Features}
					onChange={props.onChange}
				/>
				<Input
					name="Model"
					label="Model Number:"
					value={data.Model}
					onChange={props.onChange}
				/>
				<Input
					name="Hyperlink"
					label="Hyperlink:"
					value={data.Hyperlink}
					onChange={props.onChange}
				/>
				<Input
					name="Source"
					label="Source:"
					value={data.Source}
					onChange={props.onChange}
				/>
				<LabelledRange
					name="Weight_Per_Unit"
					label="Weight Per Unit"
					value={data.Weight_Per_Unit}
					onChange={props.onChange}
				/>
				<LabelledRange
					name="Quantity"
					label="Quantity"
					value={data.Quantity}
					onChange={props.onChange}
				/>
				<Input
					name="Material_And_Color"
					label="Material / Color:"
					value={data.Material_And_Color}
					onChange={props.onChange}
				/>
				<LabelledRange
					name="Size"
					label="Size"
					value={data.Size}
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