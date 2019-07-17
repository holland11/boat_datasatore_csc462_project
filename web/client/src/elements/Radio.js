import React from 'react';
import './Radio.css';

class Radio extends React.Component {
	constructor(props) {
		super(props);
		this.htmlFor = "radio-" + props.value;
	}
	render() {
		const checked = this.props.selected ? "checked" : null;
		return (
			<div className="Radio">
				<input
					type="radio"
					name={this.props.name || null}
					id={this.htmlFor}
					value={this.props.value}
					checked={checked}
					onChange={this.props.onChange}
				/>
				<label htmlFor={this.htmlFor} label={this.props.label}>
					{this.props.label}
				</label>
			</div>
		);
	}
}

export default Radio;