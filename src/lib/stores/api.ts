// Re-export from base
export { client, baseUrl } from './base';

// Re-export from users store
export { usersStore, users, usersLoading, usersError } from './users';

// Re-export from pastes store
export { pastesStore, pastes, currentPaste, pastesLoading, pastesError } from './pastes';

// For backward compatibility
import { usersLoading as loading } from './users';
import { usersError as error } from './users';
export { loading, error };

import { usersStore } from './users';
import { pastesStore } from './pastes';

// Optional: Combined store for convenience
export const apiStore = {
	...usersStore,
	...pastesStore
};

// Remove console.log after testing
