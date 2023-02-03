import { useState } from "react";

import BedIcon from "@mui/icons-material/Bed";
import ComputerIcon from "@mui/icons-material/Computer";
import WeekendIcon from "@mui/icons-material/Weekend";
import Switch from "@mui/material/Switch";

import { IRoom } from "../types/abstract";

interface IRoomProps {
	room: IRoom;
	setGroupOnOff: (groupId: string, on: boolean) => void;
}

const Room = ({ room, setGroupOnOff }: IRoomProps) => {
	const [on, setOn] = useState(room.state.any_on);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newState = e.target.checked;
		setGroupOnOff(room.id, newState);
		setOn(newState);
	};

	return (
		<div className="room">
			<div className="room-row">
				<div>{getRoomIcon(room.name)}</div>
				<div style={{ paddingLeft: "1rem" }}>{room.name}</div>
			</div>
			<div>
				<Switch checked={on} onChange={handleChange} />
			</div>
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
	}
};

export default Room;
