export type IResponse<T> = T;

export type LightsResponse = Record<string, ILight>;

export interface ILight {
	id: string;
	config: {
		archetype: string;
		direction: string;
		function: string;
		startup: {
			configured: boolean;
			mode: string;
		};
	};
	manufacturername: string;
	modelid: string;
	name: string;
	productid: string;
	state: {
		alert: string;
		bri: number;
		colormode: string;
		ct: number;
		effect: string;
		hue: number;
		mode: string;
		on: boolean;
		reachable: boolean;
		sat: number;
		xy: number[];
	};
	swconfigid: string;
	swupdate: {
		lastinstall: string;
		state: string;
	};
	type: string;
	uniqueid: string;
}

export type GroupsResponse = Record<string, IRoom>;

export interface IRoom {
	id: string;
	action: {
		alert: string;
		bri: number;
		colormode: string;
		ct: number;
		effect: string;
		hue: number;
		on: boolean;
		sat: number;
		xy: number[];
	};
	class: string;
	lights: string[];
	name: string;
	recycle: boolean;
	sensors: any[];
	state: {
		all_on: boolean;
		any_on: boolean;
	};
	type: string;
}

export type ScenesResponse = Record<string, IScene>;

export interface IScene {
	id: string;
	appdata: {
		data: string;
		version: number;
	};
	group: string;
	image: string;
	lastupdated: string;
	lights: string[];
	locked: boolean;
	name: string;
	owner: string;
	picture: string;
	recycle: boolean;
	type: string;
	version: number;
}
