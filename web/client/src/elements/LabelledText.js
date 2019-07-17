import React from 'react';
import './LabelledText.css';

function LabelledText(props) {
	const htmlFor = props.name + "-field";
	let className = "LabelledText";
	if (props.className) {
		className += " " + props.className;
	}
	return(
		<div className={className}>
			<label htmlFor={htmlFor} className={className}>
				{props.label}
			</label>
			{props.textField}
		</div>
	);
}

function Input(props) {
	const htmlFor = props.name + "-field";
	const field = (
		<input
			type="text"
			name={"text_" + props.name}
			id={htmlFor}
			value={props.value}
			onChange={props.onChange}
		/>
	);
	return(
		<LabelledText
			name={props.name}
			className="Input"
			label={props.label}
			textField={field}
		/>
	);
}
function TextArea(props) {
	const htmlFor = props.name + "-field";
	const field = (
		<textarea
			name={props.name}
			id={htmlFor}
			value={props.value}
			onChange={props.onChange}
		/>
	);
	return(
		<LabelledText
			name={props.name}
			className="TextArea"
			label={props.label}
			textField={field}
		/>
	);
}

export {
	Input,
	TextArea
}