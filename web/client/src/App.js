import React from 'react';
import './App.css';
import ReadForm from './form/ReadForm';
import QueryResult from './form/QueryResult';
import WriteForm from "./form/WriteForm";
import ModeSelector from "./elements/ModeSelector";
import Axios, * as others from 'axios';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			queryMode: 'read',
			dbChoice: 'sql',
			//Read
			read: {
				// heading: '',
				// specHeading: '',
				// gcmna: "",
				// features: "",
				// location: "",
				// category: "",
				// material: "",
				// manufacturer: "",
				// size: {min: -1, max: -1},
				// weightOne: {min: -1, max: -1},
				// quantity: {min: -1, max: -1},
				// axes: {
				// 	lcg: {min: -1, max: -1},
				// 	tcg: {min: -1, max: -1},
				// 	vcg: {min: -1, max: -1},
				// 	lm: {min: -1, max: -1},
				// 	tm: {min: -1, max: -1},
				// 	vm: {min: -1, max: -1},
				// }
			},
			//Write
			write: "",
		};
		this.handleModeChange = this.handleModeChange.bind(this);
		this.handleWriteChange = this.handleWriteChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleModeChange(event) {
		// console.log(event.target);
		this.setState({
			[event.target.name]: event.target.value
		});
		// console.log({[event.target.name]: event.target.value});
		console.log(this.state);
	}
	// handleRangeChange(event) {
	// 	const name = event.target.name;
	// 	// Check if axes
	// 	if (["lcg", "tcg", "vcg", "lm", "tm", "vm"].includes(name)) {
	// 		// Ugly, but I wanted something which worked dammit
	// 		const read = {...this.state.read};

	// 		read.axes[event.target.name] = event.target.value;
	// 		this.setState({
	// 			read: read
	// 		});
	// 	} else {

	// 	}
	// }
	handleWriteChange(event) {
		this.setState({write: event.target.value});
	}
	handleSubmit(event) {
		event.preventDefault();
		// Two cases. Read => this is a form submit. Write => Send Textarea json
		let query = {
			mode: this.state.queryMode,
			source: this.state.dbChoice,
		};
		if (this.state.queryMode === 'read') { // Read
			query.args = this.state.read;
		} else { // write
			try {
				query.args = JSON.parse(this.state.write);
			} catch (error) {
				this.setState({result: error});
			}
		}
		// Okay, query built. Send it off to our controller!
		// const showResult = (json) => this.setState({result: json});
		Axios.post('/query', query)
			.then(response => {
				this.setState({result: JSON.stringify(response.data, null, 2)});
				console.log(response.data);
			})
			// .error(error => this.setState({result: error}))
		;
	}
	render() {
		let form;
		// Decide which form to display based on Query mode
		if (this.state.queryMode === 'read') {
			form = (
				<ReadForm
					data={this.state.read}
					onChange={this.handleModeChange}
					onSubmit={this.handleSubmit}
				/>
			);
		} else {
			form = (
				<WriteForm
					input={this.state.write}
					onChange={this.handleWriteChange}
				/>
			);
		}
		return (
			<div className="App">
				<header className="App-header">
					<h1>Boat Data Store Query App</h1>
				</header>
				<ModeSelector
					choice={this.state.dbChoice}
					queryMode={this.state.queryMode}
					onChange={this.handleModeChange}
				/>
				{/* <div className="userTest">
					{this.state.users.map(user =>
						<div key={user.id}>{user.username}</div>
					)}
				</div> */}
				<main>
					{form}
					<QueryResult result={this.state.result} />
				</main>
			</div>
		);
	}
}

export default App;
