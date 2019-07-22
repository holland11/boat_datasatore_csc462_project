import React from 'react';
import {TextArea} from "../elements/LabelledText";
import './WriteForm.css';

class WriteForm extends React.Component {
	render() {
		return(
			<form onSubmit={this.props.onSubmit} className="WriteForm">
				<TextArea
					name="input-json"
					label="Insert JSON of data to be written."
					value={this.props.input}
					onChange={this.props.onChange}
				/>
				<input type="submit" value="Submit"/>
			</form>
		);
	}
}

export default WriteForm;