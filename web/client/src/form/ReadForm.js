import React from 'react';
import {AxesFields, LabelledRange} from "../elements/AxesFields";
import { Input } from "../elements/LabelledText";
import './ReadForm.css';

export default function ReadForm(props) {
	const data = props.data;
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
					value={data.quantity}
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