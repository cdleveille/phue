import { RGBColor } from "react-color";

import ColorConverter from "../helpers/ColorConverter";

export const mapKeyToId = <T = any>(data: Record<string, T>) => {
	return Object.keys(data).map(id => {
		return { ...data[id], id };
	}) as T[];
};

export const rgbToXy = (rgb: RGBColor) => {
	const { r, g, b } = rgb;
	const xy = ColorConverter.rgbToXy(r, g, b);
	return [xy.x, xy.y];
};

export const xyBriToRgb = (xy: number[], bri: number) => {
	const [x, y] = xy;
	const rgb = ColorConverter.xyBriToRgb(x, y, bri);
	return rgb as RGBColor;
};

export const rgbToHex = (rgb: RGBColor) => {
	const componentToHex = (component: number) => {
		const hex = component.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	};
	const { r, g, b } = rgb;
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const hexToRgb = (hex: string) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? ({
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
		  } as RGBColor)
		: null;
};
