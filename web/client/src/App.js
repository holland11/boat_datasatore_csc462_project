import React from 'react';
import './App.css';
import ReadForm from './form/ReadForm';
import QueryResult from './form/QueryResult';
import WriteForm from "./form/WriteForm";
import ModeSelector from "./elements/ModeSelector";
import Axios from 'axios';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			queryMode: 'read',
			dbChoice: 'sql',
			//Read
			read: {
				heading: '',
				specHeading: '',
				gcmna: "",
				features: "",
				location: "",
				category: "",
				material: "",
				manufacturer: "",
				size: {min: -1, max: -1},
				weightOne: {min: -1, max: -1},
				quantity: {min: -1, max: -1},
				axes: {
					lcg: {min: -1, max: -1},
					tcg: {min: -1, max: -1},
					vcg: {min: -1, max: -1},
					lm: {min: -1, max: -1},
					tm: {min: -1, max: -1},
					vm: {min: -1, max: -1},
				}
			},
			//Write
			write: "",
		};
		this.handleModeChange = this.handleModeChange.bind(this);
		this.handleWriteChange = this.handleWriteChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleReadChange = this.handleReadChange.bind(this);
	}
	handleModeChange(event) {
		// console.log(event.target);
		this.setState({
			[event.target.name]: event.target.value
		});
		// console.log({[event.target.name]: event.target.value});
		console.log(this.state);
	}
	handleReadChange(event) {
		const name = event.target.name;
		const value = event.target.value;
		let read = this.state.read;
		// Check if range is text
		if (name.includes("text_")) {

			read[name.slice(5)] = event.target.value;
		} else if (name.includes("axis-")) {
			const field = name.slice(5, 8);
			const bound = name.slice(-3);
			read.axes[field][bound] = value;
		} else {
			const field = name.slice(0, -4);
			const bound = name.slice(-3);
			read[field][bound] = value;
		}
		this.setState({ read: read });
		// console.log(read);
	}
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
				alert("Invalid JSON!");
				this.setState({result: error});
				return;
			}
		}
		// Okay, query built. Send it off to our controller!
		// const showResult = (json) => this.setState({result: json});
		Axios.post('/query', query)
			.then(response => {
				// this.setState({result: JSON.stringify(response.data, null, 2)});
				this.setState({result: response.data});
				console.log({...response.data});
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
					onChange={this.handleReadChange}
					onSubmit={this.handleSubmit}
				/>
			);
		} else {
			form = (
				<WriteForm
					input={this.state.write}
					onChange={this.handleWriteChange}
					onSubmit={this.handleSubmit}
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
				<main>
					{form}
					<QueryResult result={this.state.result} />
				</main>
			</div>
		);
	}
}

export default App;
