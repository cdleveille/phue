export const useConfig = () => {
	const API_URL = `https://${process.env.NEXT_PUBLIC_PHUE_BRIDGE_IP}/api/${process.env.NEXT_PUBLIC_PHUE_USERNAME}`;
	return { API_URL };
};
