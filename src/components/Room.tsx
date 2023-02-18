import { useState } from "react";

import BedIcon from "@mui/icons-material/Bed";
import ComputerIcon from "@mui/icons-material/Computer";
import HouseIcon from "@mui/icons-material/House";
import WeekendIcon from "@mui/icons-material/Weekend";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";

import { IRoom } from "../types/abstract";

interface IRoomProps {
	room: IRoom;
	setRoomOnOff: (apiUrl: string, groupId: string, on: boolean) => Promise<void>;
	setRoomBrightness: (apiUrl: string, groupId: string, bri: number) => Promise<void>;
	apiUrl: string;
}

const Room = ({ room, setRoomOnOff, setRoomBrightness, apiUrl }: IRoomProps) => {
	const [on, setOn] = useState(room.state.any_on);
	const [brightness, setBrightness] = useState(Math.round((room.action.bri / 254) * 100));

	const handleSwitchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newState = e.target.checked;
		setOn(newState);
		await setRoomOnOff(apiUrl, room.id, newState);
	};

	const handleBrightnessChange = (e: Event, value: number | number[]) => {
		setBrightness(value as number);
	};

	const handleBrightnessChangeCommitted = async (e: Event | React.SyntheticEvent, value: number | number[]) => {
		await setRoomBrightness(apiUrl, room.id, Math.round(((value as number) * 254) / 100));
	};

	return (
		<div className="room">
			<div className="room-first-row">
				<div>{getRoomIcon(room.name)}</div>
				<div style={{ marginTop: "-0.4rem" }}>{room.name}</div>
				<Switch checked={on} onChange={handleSwitchChange} />
			</div>
			<Slider
				value={brightness}
				onChange={handleBrightnessChange}
				onChangeCommitted={handleBrightnessChangeCommitted}
				valueLabelDisplay="auto"
				disabled={!on}
			/>
		</div>
	);
};

const getRoomIcon = (name: string) => {
	switch (name) {
		case "Bedroom":
			return <BedIcon />;
		case "Study":
			return <ComputerIcon />;
		case "Living Room":
			return <WeekendIcon />;
		default:
			return <HouseIcon />;
	}
};

export default Room;
