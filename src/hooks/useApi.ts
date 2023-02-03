import { IResponse } from "../types/abstract";
import { useConfig } from "./useConfig";

const { API_URL } = useConfig();

export const useApi = () => {
	const request = async <T = any>(
		method: string,
		path: string,
		body?: Record<string, string | number | boolean>,
		headers?: Record<string, string>
	) =>
		new Promise<IResponse<T>>((resolve, reject) => {
			fetch(path, {
				method,
				headers: {
					"Content-Type": "application/json",
					...headers
				},
				body: JSON.stringify(body)
			})
				.then(r => r.json())
				.then(data => {
					return resolve(data);
				})
				.catch(e => {
					return reject(e);
				});
		});

	const GET = async <T = any>(path: string) => {
		return request<T>("GET", API_URL + path);
	};

	const POST = async <T = any>(
		path: string,
		body?: Record<string, string | number | boolean>,
		headers?: Record<string, string>
	) => {
		return request<T>("POST", API_URL + path, body, headers);
	};

	const PUT = async <T = any>(
		path: string,
		body?: Record<string, string | number | boolean>,
		headers?: Record<string, string>
	) => {
		return request<T>("PUT", API_URL + path, body, headers);
	};

	const DELETE = async <T = any>(
		path: string,
		body?: Record<string, string | number | boolean>,
		headers?: Record<string, string>
	) => {
		return request<T>("DELETE", API_URL + path, body, headers);
	};

	return { GET, POST, PUT, DELETE };
};
