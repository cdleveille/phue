import { mapKeyToId } from "../helpers/util";
import { GroupsResponse, IRoom, LightsResponse, ScenesResponse } from "../types/abstract";
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

	const getRoom = async (apiUrl: string, id: string) => {
		return await GET<IRoom>(`${apiUrl}/groups/${id}`);
	};

	const setRoomOnOff = async (apiUrl: string, id: string, on: boolean) => {
		await PUT(`${apiUrl}/groups/${id}/action`, { on });
	};

	const setRoomBrightness = async (apiUrl: string, id: string, bri: number) => {
		await PUT(`${apiUrl}/groups/${id}/action`, { on: true, bri });
	};

	const setRoomScene = async (apiUrl: string, id: string, scene: string) => {
		await PUT(`${apiUrl}/groups/${id}/action`, { on: true, scene });
	};

	const setRoomColor = async (apiUrl: string, id: string, xy: number[]) => {
		await PUT(`${apiUrl}/groups/${id}/action`, { on: true, xy });
	};

	return {
		ping,
		getLights,
		getRooms,
		getScenes,
		getRoom,
		setRoomOnOff,
		setRoomBrightness,
		setRoomScene,
		setRoomColor
	};
};
