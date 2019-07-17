import React from 'react'
import './AxesFields.css';

function AxesFields(props) {
	const data = {...props.data};
	return (
		<table className="axes-fields">
			<thead>
				<tr>
					<th></th>
					<th>Longitudinal</th>
					<th>Transverse</th>
					<th>Vertical</th>
				</tr>
			</thead>
			<tbody className="axis-fields">
				<tr>
					<th>Center of Gravity</th>
					<Range wrapper="td" name="lcg" onChange={props.onChange} {...data.lcg}/>
					<Range wrapper="td" name="tcg" onChange={props.onChange} {...data.tcg}/>
					<Range wrapper="td" name="vcg" onChange={props.onChange} {...data.vcg}/>
				</tr>
				<tr>
					<th>Moment of Inertia</th>
					<Range wrapper="td" name="lm" onChange={props.onChange} {...data.lm}/>
					<Range wrapper="td" name="tm" onChange={props.onChange} {...data.tm}/>
					<Range wrapper="td" name="vm" onChange={props.onChange} {...data.vm}/>
				</tr>
			</tbody>
		</table>
	);
}
function Range(props) {
	const WrapperTag = (props.wrapper ? props.wrapper : "div");
	const name = props.name;
	return (
		<WrapperTag className="Range">
			<input
				type="number"
				name={name + "-min"}
				id={name + "-min"}
				value={props.min}
				onChange={props.onChange}
			/>
			&nbsp;to&nbsp;
			<input
				type="number"
				name={name + "-max"}
				id={name + "-max"}
				value={props.max}
				onChange={props.onChange}
			/>
		</WrapperTag>
	);
}
function LabelledRange(props) {
	const htmlFor = props.name + "-range";

	return(
		<div className="LabelledRange">
			<label htmlFor={htmlFor}>
				{props.label}
			</label>
			<Range
				name={props.name}
				min={props.min}
				max={props.max}
				onChange={props.onChange}
			/>
		</div>
	);
}
export {
	AxesFields,
	Range,
	LabelledRange
};