// Filename - App.js

import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
} from "react-router-dom";
import Home from "./Pages/Home";
import Rankings from "./Pages/Rankings";
import RawData from "./Pages/RawData";
import Search from "./Pages/Search";
import Settings from "./widgets/Settings";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

let eventCodeTemp;
if (localStorage.getItem("eventCode") === null) {
	eventCodeTemp = prompt("Event Code:");
	localStorage.setItem("eventCode", eventCodeTemp);
} else {
	eventCodeTemp = localStorage.getItem("eventCode");
}

export const eventCode = eventCodeTemp;

class App extends Component {
	render() {
		return (
			<QueryClientProvider client={queryClient}>
				<Router>
					<div className="App">
						<div className="App-header">
							<Link className="navbar-but" to="/Home">
								<div className="nav-text">
									Home
								</div>
							</Link>
							<Link className="navbar-but" to="/Rankings">
								<div className="nav-text">
									Rankings
								</div>
							</Link>
							<Link className="navbar-but" to="/Search">
								<div className="nav-text">
									Search
								</div>
							</Link>
							<Link className="navbar-but" to="/RawData">
								<div className="nav-text">
									Raw Data
								</div>
							</Link>
						</div>
						<Settings/>
						<Routes>
							<Route
								exact
								path="/Home"
								element={<Home />}
							></Route>
							<Route
								exact
								path="/Rankings"
								element={<Rankings />}
							></Route>
							<Route
								exact
								path="/RawData"
								element={<RawData />}
							></Route>
							<Route
								exact
								path="/Search"
								element={<Search />}
							></Route>
						</Routes>
					</div>
				</Router>
			</QueryClientProvider>
		);
	}
}

export default App;
