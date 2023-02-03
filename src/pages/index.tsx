import { useEffect, useState } from "react";

import Head from "../components/Head";
import Room from "../components/Room";
import { useLights } from "../hooks/useLights";
import { IRoom } from "../types/abstract";

const Home = () => {
	const [rooms, setRooms] = useState<IRoom[]>();
	const { getRooms, setGroupOnOff } = useLights();

	useEffect(() => {
		(async () => {
			setRooms(await getRooms());
		})();
	}, []);

	return (
		<>
			<Head />
			<div className="content absolute-centered">
				{rooms?.map((room, i) => {
					return <Room key={i} room={room} setGroupOnOff={setGroupOnOff} />;
				})}
			</div>
		</>
	);
};

export default Home;
