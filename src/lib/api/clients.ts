// src/lib/api/client.ts
import createClient from 'openapi-fetch';
import type { paths as memoriaPaths } from './memoria.v1';
import type { paths as portusPaths } from './portus.v1';

const isDev = import.meta.env.DEV;

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const PORTIS_API_BASE_URL =
	import.meta.env.VITE_SHORTEN_API_BASE_URL || 'http://localhost:8181';

console.log(PORTIS_API_BASE_URL);

// Create a typed client
export const { GET, POST, PUT, DELETE } = createClient<memoriaPaths>({
	baseUrl: isDev ? 'http://localhost:8080/api/v1' : '/api/v1'
});

export const {
	GET: GET_PORTIS,
	POST: POST_PORTIS,
	PUT: PUT_PORTIS,
	DELETE: DELETE_PORTIS
} = createClient<portusPaths>({
	baseUrl: isDev ? 'http://localhost:6663/api/v1' : PORTIS_API_BASE_URL
});
