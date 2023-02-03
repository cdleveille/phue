import { mapKeyToId } from "../helpers/util";
import { GroupsResponse, LightsResponse, ScenesResponse } from "../types/abstract";
import { useApi } from "./useApi";

const { GET, PUT } = useApi();

export const useLights = () => {
	const getLights = async () => {
		const res = await GET<LightsResponse>("/lights");
		return mapKeyToId(res);
	};

	const getRooms = async () => {
		const res = await GET<GroupsResponse>("/groups");
		const rooms = mapKeyToId(res);
		return rooms.filter(room => room.type === "Room");
	};

	const getScenes = async () => {
		const res = await GET<ScenesResponse>("/scenes");
		return mapKeyToId(res);
	};

	const setGroupOnOff = async (groupId: string, on: boolean) => {
		await PUT(`/groups/${groupId}/action`, { on });
	};

	return { getLights, getRooms, getScenes, setGroupOnOff };
};
