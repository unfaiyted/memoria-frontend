// src/lib/api/client.ts
import createClient from 'openapi-fetch';
import type { paths } from './v1';

const isDev = import.meta.env.DEV;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

console.log('API_BASE_URL', API_BASE_URL);
// Create a typed client
export const { GET, POST, PUT, DELETE } = createClient<paths>({
	baseUrl: isDev ? 'http://localhost:8080/api/v1' : '/api/v1'
});
