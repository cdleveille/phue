import { IResponse } from "../types/abstract";

export const useApi = () => {
	const request = async <T = any>(
		method: string,
		path: string,
		body?: Record<string, any>,
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

	const GET = async <T = any>(path: string, headers?: Record<string, string>) => {
		return request<T>("GET", path, undefined, headers);
	};

	const POST = async <T = any>(path: string, body?: Record<string, any>, headers?: Record<string, string>) => {
		return request<T>("POST", path, body, headers);
	};

	const PUT = async <T = any>(path: string, body?: Record<string, any>, headers?: Record<string, string>) => {
		return request<T>("PUT", path, body, headers);
	};

	const DELETE = async <T = any>(path: string, body?: Record<string, any>, headers?: Record<string, string>) => {
		return request<T>("DELETE", path, body, headers);
	};

	return { GET, POST, PUT, DELETE };
};
