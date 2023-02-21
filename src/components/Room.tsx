import { useState } from "react";
import { ChromePicker, ColorResult, RGBColor } from "react-color";

import BedIcon from "@mui/icons-material/Bed";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DeskIcon from "@mui/icons-material/Desk";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HouseIcon from "@mui/icons-material/House";
import PaletteIcon from "@mui/icons-material/Palette";
import WeekendIcon from "@mui/icons-material/Weekend";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import { rgbToXy, xyBriToRgb } from "../helpers/util";
import { useLights } from "../hooks/useLights";
import { IRoom, IScene } from "../types/abstract";

interface IRoomProps {
	room: IRoom;
	scenes: IScene[] | undefined;
	apiUrl: string;
}

const Room = ({ room, scenes, apiUrl }: IRoomProps) => {
	const [on, setOn] = useState(room.state.any_on);
	const [brightness, setBrightness] = useState(Math.round((room.action.bri / 254) * 100));
	const [color, setColor] = useState<RGBColor>(xyBriToRgb(room.action.xy, Math.round((room.action.bri / 254) * 100)));

	const { getRoom, setRoomOnOff, setRoomBrightness, setRoomScene, setRoomColor } = useLights();

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
		setColor(xyBriToRgb(res.action.xy, Math.round((res.action.bri / 254) * 100)));
		if (!on) setOn(true);
	};

	const onColorChange = (color: ColorResult, _event: React.ChangeEvent<HTMLInputElement>) => setColor(color.rgb);

	const onColorChangeComplete = async (color: ColorResult, _event: React.ChangeEvent<HTMLInputElement>) => {
		const xy = rgbToXy(color.rgb);
		await setRoomColor(apiUrl, room.id, xy);
		if (!on) setOn(true);
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
			<Accordion
				disableGutters
				square
				sx={{
					"&:before": {
						display: "none"
					},
					fontSize: "1rem",
					backgroundColor: "#252526",
					color: "#c4c4c4",
					marginTop: "0.5rem",
					borderColor: "blue",
					borderRadius: "0.5rem",
					border: "2px solid #c4c4c4"
				}}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon sx={{ color: "#c4c4c4" }} />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography align="center" sx={{ width: "100%", marginLeft: "1rem" }}>
						Scenes
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
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
				</AccordionDetails>
			</Accordion>
			<Accordion
				disableGutters
				square
				sx={{
					"&:before": {
						display: "none"
					},
					fontSize: "1rem",
					backgroundColor: "#252526",
					color: "#c4c4c4",
					marginTop: "1rem",
					borderColor: "blue",
					borderRadius: "0.5rem",
					border: "2px solid #c4c4c4"
				}}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon sx={{ color: "#c4c4c4" }} />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography align="center" sx={{ width: "100%", marginLeft: "1rem" }}>
						Colors
					</Typography>
				</AccordionSummary>
				<AccordionDetails
					sx={{ display: "flex", flexDirection: "row", justifyContent: "center", marginBottom: "0.5rem" }}
				>
					<ChromePicker
						styles={{
							default: {
								body: { backgroundColor: "#1e1e1e" }
							}
						}}
						color={color}
						onChange={onColorChange}
						onChangeComplete={onColorChangeComplete}
						disableAlpha={true}
					/>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

const getRoomIcon = (name: string) => {
	switch (name) {
		case "Bedroom":
			return <BedIcon />;
		case "Study":
			return <DeskIcon />;
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
