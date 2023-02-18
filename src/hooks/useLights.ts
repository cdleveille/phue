import { mapKeyToId } from "../helpers/util";
import { GroupsResponse, LightsResponse, ScenesResponse } from "../types/abstract";
import { useApi } from "./useApi";

const { GET, PUT } = useApi();

export const useLights = () => {
	const ping = async (apiUrl: string) => {
		return await GET<any>(apiUrl);
	};

	const getLights = async (apiUrl: string) => {
		const res = await GET<LightsResponse>(`${apiUrl}/lights`);
		return mapKeyToId(res);
	};

	const getRooms = async (apiUrl: string) => {
		const res = await GET<GroupsResponse>(`${apiUrl}/groups`);
		const rooms = mapKeyToId(res);
		return rooms.filter(room => room.type === "Room");
	};

	const getScenes = async (apiUrl: string) => {
		const res = await GET<ScenesResponse>(`${apiUrl}/scenes`);
		return mapKeyToId(res);
	};

	const setRoomOnOff = async (apiUrl: string, id: string, on: boolean) => {
		await PUT(`${apiUrl}/groups/${id}/action`, { on });
	};

	const setRoomBrightness = async (apiUrl: string, id: string, bri: number) => {
		await PUT(`${apiUrl}/groups/${id}/action`, { bri });
	};

	return { ping, getLights, getRooms, getScenes, setRoomOnOff, setRoomBrightness };
};
