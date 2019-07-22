import React from 'react';
import ReactJson from "react-json-view";
import './QueryResult.css';

class QueryResult extends React.Component {
	render() {
		console.log(this.props.result);
		if (typeof this.props.result !== 'string') {
			return (
				<ReactJson src={this.props.result} />
			);
		} else {
			return (
				<pre className="QueryResult">{this.props.result}</pre>
			);
		}
	}
}
export default QueryResult;