import React from 'react';
import Radio from "./Radio";
import './ModeSelector.css';

function DBRadio(props) {
	const name = props.name;
	const choice = props.choice;
	const onChange = (e) => props.onChange(e);
	return (
		<div className="DBRadio">
			<Radio
				name={name}
				value="sql"
				label="MySQL"
				selected={choice === "sql"}
				onChange={onChange}
			/>
			<Radio
				name={name}
				value="mongo"
				label="MongoDB"
				selected={choice === "mongo"}
				onChange={onChange}	
			/>
			<Radio
				name={name}
				value="both"
				label="Both (Performance Comparison)"
				selected={choice === "both"}
				onChange={onChange}
			/>
		</div>
	);
}

function ReadWriteRadio(props) {
	const name = props.name;
	const choice = props.choice;
	const onChange = (e) => props.onChange(e);
	return (
		<div className="ReadWriteRadio">
			<Radio
				name={name}
				value="read"
				label="Read"
				required={true}
				selected={choice === "read"}
				onChange={onChange}
			/>
			<Radio
				name={name}
				value="write"
				label="Write"
				required={true}
				selected={choice === "write"}
				onChange={onChange}
			/>
		</div>
	);
}

function ModeSelector(props) {
	// const onChange = (e) => props.onChange(e);
	return (
		<div className="ModeSelector">
			<DBRadio
				name="dbChoice"
				choice={props.choice}
				onChange={props.onChange}
			/>
			<ReadWriteRadio
				name="queryMode"
				choice={props.queryMode}
				onChange={props.onChange}
			/>
		</div>
	);
}
export default ModeSelector;