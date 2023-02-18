import { useState } from "react";

import BedIcon from "@mui/icons-material/Bed";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ComputerIcon from "@mui/icons-material/Computer";
import HouseIcon from "@mui/icons-material/House";
import PaletteIcon from "@mui/icons-material/Palette";
import WeekendIcon from "@mui/icons-material/Weekend";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";

import { IRoom, IScene } from "../types/abstract";

interface IRoomProps {
	room: IRoom;
	scenes: IScene[] | undefined;
	setRoomOnOff: (apiUrl: string, id: string, on: boolean) => Promise<void>;
	setRoomBrightness: (apiUrl: string, id: string, bri: number) => Promise<void>;
	setRoomScene: (apiUrl: string, id: string, scene: string) => Promise<void>;
	apiUrl: string;
	getRoom: (apiUrl: string, id: string) => Promise<IRoom>;
}

const Room = ({ room, scenes, setRoomOnOff, setRoomBrightness, setRoomScene, apiUrl, getRoom }: IRoomProps) => {
	const [on, setOn] = useState(room.state.any_on);
	const [brightness, setBrightness] = useState(Math.round((room.action.bri / 254) * 100));
	const [showScenes, setShowScenes] = useState(false);

	const handleSwitchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newState = e.target.checked;
		setOn(newState);
		await setRoomOnOff(apiUrl, room.id, newState);
	};

	const handleBrightnessChange = (_e: Event, value: number | number[]) => {
		setBrightness(value as number);
	};

	const handleBrightnessChangeCommitted = async (_e: Event | React.SyntheticEvent, value: number | number[]) => {
		await setRoomBrightness(apiUrl, room.id, Math.round(((value as number) * 254) / 100));
	};

	const handleSceneChange = async (sceneId: string) => {
		await setRoomScene(apiUrl, room.id, sceneId);
		const res = await getRoom(apiUrl, room.id);
		setBrightness(Math.round((res.action.bri / 254) * 100));
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
			<div style={{ textAlign: "center" }}>
				<Button variant="outlined" onClick={() => setShowScenes(!showScenes)}>
					Scenes
				</Button>
			</div>
			{showScenes && (
				<div className="scene-list">
					<MenuList>
						{scenes
							?.filter(scene => scene.group === room.id)
							?.sort((a, b) => {
								const aName = a.name.toUpperCase();
								const bName = b.name.toUpperCase();
								return aName < bName ? -1 : aName > bName ? 1 : 0;
							})
							?.map((scene, i) => {
								return (
									<MenuItem key={i} onClick={() => handleSceneChange(scene.id)}>
										<ListItemIcon>
											{getSceneIcon(scene.name, { color: "#c4c4c4" })}
											<ListItemText style={{ color: "#c4c4c4", paddingLeft: "0.5rem" }}>
												{scene.name}
											</ListItemText>
										</ListItemIcon>
									</MenuItem>
								);
							})}
					</MenuList>
				</div>
			)}
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

const getSceneIcon = (name: string, style: React.CSSProperties) => {
	switch (name) {
		case "Bright":
			return <Brightness7Icon style={style} fontSize="small" />;
		case "Normal":
			return <Brightness6Icon style={style} fontSize="small" />;
		case "Relax":
			return <Brightness5Icon style={style} fontSize="small" />;
		case "Dimmed":
			return <Brightness4Icon style={style} fontSize="small" />;
		case "Nightlight":
			return <BedtimeIcon style={style} fontSize="small" />;
		default:
			return <PaletteIcon style={style} fontSize="small" />;
	}
};

export default Room;
