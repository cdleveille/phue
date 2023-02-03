export const mapKeyToId = <T = any>(data: Record<string, T>) => {
	return Object.keys(data).map(id => {
		return { ...data[id], id };
	}) as T[];
};
