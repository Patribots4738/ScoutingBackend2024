// Filename - component/home.js
import React from "react";

const currentDate = new Date();

let event = (localStorage.getItem("eventCode"));
let game = ("REEFSCAPE");
let season = ("DIVE");
let year = (currentDate.getFullYear());

function Home() {
	return (
		<div className="Franks-Header">
			<h1>
				Welcome to Frank's backend!
			</h1>
			<h2>
				Patribots Scouting Data
			</h2>
			<h3>
				<div>Event: {event}</div>
				<div>Game: {game}</div>
				<div>Season: {season}</div>
				<div>Year: {year}</div>
			</h3>
		</div>
	);
}
export default Home;
