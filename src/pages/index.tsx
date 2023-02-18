import { useEffect, useState } from "react";

import Auth from "../components/Auth";
import Head from "../components/Head";
import Room from "../components/Room";
import { useLights } from "../hooks/useLights";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { IRoom } from "../types/abstract";
import { LOCAL_STORAGE_KEY } from "../types/constants";

const Home = () => {
	const [rooms, setRooms] = useState<IRoom[]>();
	const [apiUrl, setApiUrl] = useState("");
	const { getLocalStorageItem, setLocalStorageItem } = useLocalStorage();
	const { ping, getRooms, setRoomOnOff, setRoomBrightness } = useLights();

	useEffect(() => {
		const url = getLocalStorageItem<string>(LOCAL_STORAGE_KEY);
		if (url) setApiUrl(url);
	}, []);

	useEffect(() => {
		if (!apiUrl) return;
		(async () => {
			setRooms(await getRooms(apiUrl));
		})();
	}, [apiUrl]);

	return (
		<>
			<Head />
			<div className="content absolute-centered">
				{apiUrl ? (
					rooms?.map((room, i) => {
						return (
							<Room
								key={i}
								room={room}
								setRoomOnOff={setRoomOnOff}
								setRoomBrightness={setRoomBrightness}
								apiUrl={apiUrl}
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
