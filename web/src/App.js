import TextField from "@material-ui/core/TextField";
import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import io from "socket.io-client";
import "./App.css";
const { detect } = require('detect-browser');
const browser = detect();
const ip = require('ip');

function App() {
	const [state, setState] = useState({ message: "", name: "" })
	const [chat, setChat] = useState([])
	// const [browsers, setBrowsers] = useState({ b_name: "", b_version: "", b_os: "" })

	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([...chat, { name, message }])
			})
			return () => socketRef.current.disconnect()
		},
		[chat]
	)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		// const user_agent_details = {};
		const { name, message } = state;
		socketRef.current.emit("message", { name, message })
		e.preventDefault();
		// if (browser) {
		// 	// console.log(browser.name);
		// 	// console.log(browser.version);
		// 	// console.log(browser.os);
		// 	user_agent_details.name = browser.name;
		// 	user_agent_details.version = browser.version;
		// 	user_agent_details.os = browser.os
		// }

		const post_data = {
			name: name,
			message: message,
		}

		axios.post('http://localhost:4000/app/post', post_data)
			.then(response => console.log(response.data))

		setState({ message: "", name })
	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
	}

	const renderSystemDetails = () => {
		const b_details = [browser.name, browser.version, browser.os];
		const ipDetails = ip.address();
		return (
			<div>
				<h3>
					{b_details[0]}
					{"\n"}
					{b_details[1]}
					{"\n"}
					{b_details[2]}
					{"\n"}
					{ipDetails}
				</h3>
			</div>
		)
	}

	return (
		<div className="card">
			<form onSubmit={onMessageSubmit}>
				<h1>User Post</h1>
				<div className="name-field">
					<TextField name="name" onChange={(e) => onTextChange(e)} value={state.name} label="Name" />
				</div>
				<div>
					<TextField
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Message"
					/>
				</div>
				<button>Submit</button>
			</form>
			<div className="render-chat">
				<h1>Post Log</h1>
				{renderChat()}
			</div>
			<div className="render-system-details">
				<h1>Notification</h1>
				{renderSystemDetails()}
			</div>
		</div>
	)
}

export default App

