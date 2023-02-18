import { useEffect, useState } from "react";

import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";

import Auth from "../components/Auth";
import Head from "../components/Head";
import Room from "../components/Room";
import { useLights } from "../hooks/useLights";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { IRoom, IScene } from "../types/abstract";
import { LOCAL_STORAGE_KEY } from "../types/constants";

const Home = () => {
	const [rooms, setRooms] = useState<IRoom[]>();
	const [scenes, setScenes] = useState<IScene[]>();
	const [apiUrl, setApiUrl] = useState("");
	const { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } = useLocalStorage();
	const { ping, getRooms, getScenes, getRoom, setRoomOnOff, setRoomBrightness, setRoomScene } = useLights();

	useEffect(() => {
		const url = getLocalStorageItem<string>(LOCAL_STORAGE_KEY);
		if (url) setApiUrl(url);
	}, []);

	useEffect(() => {
		if (!apiUrl) return;
		(async () => {
			const [rooms, scenes] = await Promise.all([getRooms(apiUrl), getScenes(apiUrl)]);
			setRooms(rooms);
			setScenes(scenes);
		})();
	}, [apiUrl]);

	const logOut = () => {
		removeLocalStorageItem(LOCAL_STORAGE_KEY);
		setApiUrl("");
	};

	return (
		<>
			<Head />
			{apiUrl && (
				<div className="logout-btn">
					<IconButton onClick={logOut} sx={{ color: "#c4c4c4", border: "2px solid #c4c4c4" }}>
						<LogoutIcon />
					</IconButton>
				</div>
			)}
			<div className="content absolute-centered">
				{apiUrl ? (
					rooms?.map((room, i) => {
						return (
							<Room
								key={i}
								room={room}
								scenes={scenes}
								setRoomOnOff={setRoomOnOff}
								setRoomBrightness={setRoomBrightness}
								setRoomScene={setRoomScene}
								apiUrl={apiUrl}
								getRoom={getRoom}
							/>
						);
					})
				) : (
					<Auth setLocalStorageItem={setLocalStorageItem} setApiUrl={setApiUrl} ping={ping} />
				)}
			</div>
		</>
	);
};

export default Home;
