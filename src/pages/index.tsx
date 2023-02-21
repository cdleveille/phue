import { useEffect, useState } from "react";

import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";

import Auth from "../components/Auth";
import Head from "../components/Head";
import Room from "../components/Room";
import { useLights } from "../hooks/useLights";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { IRoom, IScene } from "../types/abstract";
import { API_URL_LOCAL_STORAGE_KEY } from "../types/constants";

const Home = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [rooms, setRooms] = useState<IRoom[]>();
	const [scenes, setScenes] = useState<IScene[]>();
	const [apiUrl, setApiUrl] = useState("");
	const { getLocalStorageItem, removeLocalStorageItem } = useLocalStorage();
	const { getRooms, getScenes } = useLights();

	useEffect(() => {
		const url = getLocalStorageItem<string>(API_URL_LOCAL_STORAGE_KEY);
		if (url) setApiUrl(url);
		setIsLoading(false);
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
		removeLocalStorageItem(API_URL_LOCAL_STORAGE_KEY);
		setApiUrl("");
	};

	if (isLoading) return <Head />;

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
			<div className="rooms">
				{apiUrl ? (
					rooms?.map((room, i) => {
						return <Room key={i} room={room} scenes={scenes} apiUrl={apiUrl} />;
					})
				) : (
					<div className="absolute-centered">
						<Auth setApiUrl={setApiUrl} />
					</div>
				)}
			</div>
		</>
	);
};

export default Home;
