// component that takes in a trip name and time and creates a countdown timer

import { useState, useEffect } from "react";
import { RichText } from "@wordpress/block-editor";
import { Popover, Button, TextControl } from "@wordpress/components";
import { edit } from "@wordpress/icons";

export default function TripCounter({
	tripName,
	tripTime,
	setTripName,
	updateTripTime,
}) {
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(tripTime));
	const [isInvisible, setIsInvisble] = useState(true);
	const toggleVisible = () => {
		setIsInvisble((state) => !state);
	};
	const [secondsLeft, setSecondsLeft] = useState(
		calculateSecondsLeft(tripTime),
	);

	useEffect(() => {
		const interval = setInterval(() => {
			const secondsLeft = calculateTimeLeft(tripTime);
			if (secondsLeft <= 0) {
				clearInterval(interval);
			}
			setTimeLeft(getTimeLeftMessage(secondsLeft));
			setSecondsLeft(calculateSecondsLeft(tripTime));
		}, 500);
		return () => {
			clearInterval(interval);
		};
	}, [tripTime]);

	function encouragementAreaClasses() {
		const classes = ["encouragementArea"];
		if (secondsLeft < 60) {
			classes.push("encouragementAreaRed");
		}
		if (secondsLeft < 300) {
			classes.push("encouragementAreaYellow");
		}
		if (secondsLeft >= 300) {
			classes.push("encouragementAreaGreen");
		}

		return classes.join(" ");
	}

	function encouragementAreaText() {
		if (secondsLeft > 300 && secondsLeft < 600) {
			return "Almost time to leave!";
		} else if (secondsLeft < 300) {
			return "Time to go!";
		} else {
			return "Let's go!";
		}
	}

	return (
		<div class="CountdownPage">
			<RichText
				tagName="h2"
				value={tripName}
				onChange={setTripName}
				withoutInteractiveFormatting
				placeholder="Trip name"
				allowedFormats={[]}
			/>
			<div class={"timeInfo" + getTimeInfoColorClass(secondsLeft)}>
				<div>Out the door at {niceHumanTime(tripTime)}</div>
				<div style={{ position: "relative" }}>
					<span>{timeLeft}</span>
					{
						<Button variant="tertiary" icon={edit} onClick={toggleVisible}>
							{!isInvisible && (
								<Popover onClose={toggleVisible}>
									<div className="time-popup-styles">
										<TextControl
											label="Trip Time"
											value={tripTime}
											placeholder="Enter trip time"
											onChange={updateTripTime}
											type="time"
										/>
									</div>
								</Popover>
							)}
						</Button>
					}
				</div>
			</div>
			<div class="otherStuff">
				<div className={encouragementAreaClasses()}>{encouragementAreaText()}</div>
			</div>
		</div>
	);
}

function calculateSecondsLeft(time) {
	const departureTime = new Date();
	const currentTime = new Date();

	const [hours, minutes] = time.split(":");

	departureTime.setHours(hours);
	departureTime.setMinutes(minutes);
	departureTime.setSeconds(0);

	return Math.floor((departureTime - currentTime) / 1000); // millis to seconds
}

function getTimeInfoColorClass(secondsLeft) {
	if (secondsLeft < 60) {
		return " timeInfoRed";
	} else if (secondsLeft < 300) {
		return " timeInfoYellow";
	} else {
		return " timeInfoGreen";
	}
}

function niceHumanTime(time) {
	const now = new Date();

	const [hours, minutes] = time.split(":");

	now.setHours(hours);
	now.setMinutes(minutes);

	return now.toLocaleString("en-us", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
}

function calculateTimeLeft(time) {
	const now = new Date();
	const then = new Date();

	const [hours, minutes] = time.split(":");

	now.setHours(hours);
	now.setMinutes(minutes);
	now.setSeconds(0);

	return (now - then) / 1000; // millis
}

function getTimeLeftMessage(secondsLeft) {
	if (secondsLeft <= 0) {
		return "The trip has started!";
	} else if (secondsLeft > 3600) {
		let hours = Math.floor(secondsLeft / 3600);
		let minutes = Math.floor((secondsLeft % 3600) / 60);

		return `${hours} Hours and ${minutes} minutes LEFT!`;
	} else if (secondsLeft > 60) {
		let minutes = Math.floor(secondsLeft / 60);
		let seconds = Math.floor(secondsLeft % 60);

		return `${minutes}:${seconds.toString().padStart(2, "0")} LEFT!`;
	}

	return `${secondsLeft} SECONDS`;
}
