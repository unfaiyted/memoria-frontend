// src/lib/api/errors.ts
import type { ErrorResponse, ErrorType } from './types';

export class ApiError extends Error {
	error: ErrorType;
	details: Record<string, unknown>;
	request_id?: string;
	timestamp?: string;
	status: number;

	constructor(errorResponse: ErrorResponse, status: number = 500) {
		super(errorResponse?.message || 'Unknown API error');
		this.name = 'ApiError';
		this.error = errorResponse?.error || 'INTERNAL_ERROR';
		this.details = errorResponse?.details || {};
		this.request_id = errorResponse?.request_id;
		this.timestamp = errorResponse?.timestamp;
		this.status = status;

		// Ensure proper prototype chain for instanceof checks
		Object.setPrototypeOf(this, ApiError.prototype);
	}
}
