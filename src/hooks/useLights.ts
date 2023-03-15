import { useEffect, useState } from "react";

import { buildApiBaseUrl, mapKeyToId } from "../helpers/util";
import { GroupsResponse, IRoom, LightsResponse, ScenesResponse } from "../types/abstract";
import { BRIDGE_IP_LOCAL_STORAGE_KEY, USERNAME_LOCAL_STORAGE_KEY } from "../types/constants";
import { useApi } from "./useApi";
import { useLocalStorage } from "./useLocalStorage";

const { GET, PUT } = useApi();

export const useLights = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [apiUrl, setApiUrl] = useState("");
	const [username, setUsername] = useState("");
	const { getLocalStorageItem } = useLocalStorage();

	const headers = { "hue-application-key": username };

	useEffect(() => {
		const bridgeIP = getLocalStorageItem<string>(BRIDGE_IP_LOCAL_STORAGE_KEY);
		if (bridgeIP) setApiUrl(buildApiBaseUrl(bridgeIP));
		const usernameValue = getLocalStorageItem<string>(USERNAME_LOCAL_STORAGE_KEY);
		if (usernameValue) setUsername(usernameValue);
		setIsLoading(false);
	}, []);

	const ping = async (url?: string) => {
		return GET(`${url ?? apiUrl}/bridge`, headers);
	};

	const getLights = async () => {
		const res = await GET<LightsResponse>(`${apiUrl}/lights`);
		return mapKeyToId(res);
	};

	const getRooms = async () => {
		const res = await GET<GroupsResponse>(`${apiUrl}/groups`);
		const rooms = mapKeyToId(res);
		return rooms.filter(room => room.type === "Room");
	};

	const getScenes = async () => {
		const res = await GET<ScenesResponse>(`${apiUrl}/scenes`);
		return mapKeyToId(res);
	};

	const getRoom = async (id: string) => {
		return GET<IRoom>(`${apiUrl}/groups/${id}`);
	};

	const setRoomOnOff = async (id: string, on: boolean) => {
		return PUT(`${apiUrl}/groups/${id}/action`, { on });
	};

	const setRoomBrightness = async (id: string, bri: number) => {
		return PUT(`${apiUrl}/groups/${id}/action`, { on: true, bri });
	};

	const setRoomScene = async (id: string, scene: string) => {
		return PUT(`${apiUrl}/groups/${id}/action`, { on: true, scene });
	};

	const setRoomColor = async (id: string, xy: number[]) => {
		return PUT(`${apiUrl}/groups/${id}/action`, { on: true, xy });
	};

	return {
		isLoading,
		apiUrl,
		setApiUrl,
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
