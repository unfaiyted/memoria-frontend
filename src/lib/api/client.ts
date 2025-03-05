// src/lib/api/client.ts
import createClient from 'openapi-fetch';
import type { paths } from './v1';

// Create a typed client
export const { GET, POST, PUT, DELETE } = createClient<paths>({
	baseUrl: 'http://localhost:8080/api/v1'
});
