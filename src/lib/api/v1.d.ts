/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * checks app and database health
         * @description returns JSON object with health statuses.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.HealthResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/paste": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Update paste
         * @description Update a pastes value
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Updated paste data */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["models.UpdatePasteRequest"];
                };
            };
            responses: {
                /** @description Success response with paste data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.APIResponse-models_PasteData"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Paste not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        /**
         * Create paste
         * @description Creates a new paste
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Paste data */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["models.CreatePasteRequest"];
                };
            };
            responses: {
                /** @description Success response with paste data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.APIResponse-models_PasteData"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        /**
         * Deletes paste by ID
         * @description delete a paste by ID
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Paste ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.APIResponse-uint64"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/paste/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lists out all the pastes
         * @description Returns a list of all the pastes. # TODO: pagination
         */
        get: {
            parameters: {
                query?: {
                    /** @description Page number */
                    page?: number;
                    /** @description Items per page */
                    limit?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Success response with paste list data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.APIResponse-models_PasteListData"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/paste/private/batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Gets multiple pastes using their private access IDs
         * @description Retrieve multiple pastes by providing a comma-separated list of private access IDs
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description List of private access IDs */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["models.PrivateAccessIDsRequest"];
                };
            };
            responses: {
                /** @description Success response with list of pastes */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.APIResponse-models_PasteListData"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/paste/private/{accessId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Gets a specific private paste using its private access ID
         * @description Retrieve a private paste by its private access ID
         */
        get: {
            parameters: {
                query?: {
                    /** @description Password for protected pastes */
                    pw?: string;
                };
                header?: never;
                path: {
                    /** @description Private Access ID */
                    accessId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Success response with paste data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.APIResponse-models_PasteData"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Paste not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/paste/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Gets a specific paste
         * @description Retrieve a paste by ID
         */
        get: {
            parameters: {
                query?: {
                    /** @description Password for protected pastes */
                    pw?: string;
                };
                header?: never;
                path: {
                    /** @description Paste ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Success response with paste data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.APIResponse-models_PasteData"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Pssword required or invalid password */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Paste not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List users
         * @description Get all users in the system
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.UserResponse"][];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Create a new user
         * @description Create a new user in the system
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: components["requestBodies"]["models.User"];
            responses: {
                /** @description Created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.UserResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a user
         * @description Get a user by ID
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description User ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.UserResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        /**
         * Update a user
         * @description Update a user's information
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description User ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody: components["requestBodies"]["models.User"];
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.UserResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        /**
         * Delete a user
         * @description Delete a user by ID
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description User ID */
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description No Content */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["models.ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        "models.APIResponse-models_PasteData": {
            data?: components["schemas"]["models.PasteData"];
            /** @example Operation successful */
            message?: string;
            /** @example true */
            success?: boolean;
        };
        "models.APIResponse-models_PasteListData": {
            data?: components["schemas"]["models.PasteListData"];
            /** @example Operation successful */
            message?: string;
            /** @example true */
            success?: boolean;
        };
        "models.APIResponse-uint64": {
            data?: number;
            /** @example Operation successful */
            message?: string;
            /** @example true */
            success?: boolean;
        };
        "models.CreatePasteRequest": {
            content: string;
            /**
             * @example code
             * @enum {string}
             */
            editorType?: "code" | "text";
            /** @example 2023-01-08T00:00:00Z */
            expiresAt?: string;
            /** @example mySecurePassword123 */
            password?: string;
            /** @enum {string} */
            privacy: "public" | "private" | "password";
            syntaxHighlight?: string;
            title: string;
        };
        "models.ErrorResponse": {
            details?: {
                [key: string]: unknown;
            };
            /** @example FAILED_CHECK */
            error?: components["schemas"]["models.ErrorType"];
            /** @example This is a pretty message */
            message?: string;
            request_id?: string;
            timestamp?: string;
        };
        /** @enum {string} */
        "models.ErrorType": "FAILED_CHECK" | "UNAUTHORIZED" | "NOT_FOUND" | "BAD_REQUEST" | "INTERNAL_ERROR" | "FORBIDDEN" | "CONFLICT" | "VALIDATION_ERROR" | "RATE_LIMITED" | "TIMEOUT" | "SERVICE_UNAVAILABLE" | "UNPROCESSABLE_ENTITY";
        "models.HealthResponse": {
            /** @example true */
            application: boolean;
            /** @example true */
            database: boolean;
            /**
             * @description Overall status of the system
             * @example up
             * @enum {string}
             */
            status: "up" | "down" | "degraded";
        };
        /** @description A text snippet with formatting, expiration, and privacy settings */
        "models.Paste": {
            /** @example console.log('Hello world'); */
            content: string;
            /** @example 2023-01-01T00:00:00Z */
            createdAt?: string;
            /**
             * @example code
             * @enum {string}
             */
            editorType: "code" | "text";
            /** @example 2023-01-08T00:00:00Z */
            expiresAt?: string;
            /** @example 123111 */
            id: number;
            /**
             * @description "public", "private"
             * @example public
             * @enum {string}
             */
            privacy: "public" | "private";
            /** @example abc123xyz456 */
            privateAccessId?: string;
            /** @example javascript */
            syntaxHighlight: string;
            /** @example My Code Snippet */
            title: string;
            /** @example u98765zyxwv */
            user_id?: string;
        };
        "models.PasteData": {
            paste?: components["schemas"]["models.Paste"];
        };
        /** @description List of pastes response wrapper */
        "models.PasteListData": {
            count?: number;
            pastes?: components["schemas"]["models.Paste"][];
        };
        "models.PrivateAccessIDsRequest": {
            /** @example abc123,def456,ghi789 */
            accessIds: string;
        };
        "models.UpdatePasteRequest": {
            content: string;
            editorType?: string;
            /** @example 2023-01-08T00:00:00Z */
            expiresAt?: string;
            id: number;
            /** @example mySecurePassword123 */
            password?: string;
            /** @enum {string} */
            privacy: "public" | "private" | "password";
            syntaxHighlight?: string;
            title: string;
        };
        "models.User": {
            /** @example john@example.com */
            email: string;
            /** @example 1 */
            id?: number;
            /** @example John Doe */
            name: string;
            /**
             * Format: password
             * @description omitempty will exclude it from JSON responses
             * @example strongpassword123
             */
            password: string;
        };
        "models.UserResponse": {
            email?: string;
            id?: number;
            name?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: {
        /** @description User data */
        "models.User": {
            content: {
                "application/json": components["schemas"]["models.User"];
            };
        };
    };
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
