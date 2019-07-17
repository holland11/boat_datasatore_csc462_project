import React from 'react';
import './QueryResult.css';

class QueryResult extends React.Component {
	render() {
		return (
			<pre className="QueryResult">{this.props.result}</pre>
		);
	}
}
export default QueryResult;