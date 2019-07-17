import React from 'react';
import {TextArea} from "../elements/LabelledText";
import './WriteForm.css';

class WriteForm extends React.Component {
	render() {
		return(
			<div className="WriteForm">
				<TextArea
					name="input-json"
					label="Insert JSON of data to be written."
					value={this.props.input}
					onChange={this.props.onChange}
				/>
			</div>
		);
	}
}

export default WriteForm;