import { derived } from 'svelte/store';
import { createBaseStore, type BaseApiState } from './base';
import { GET, POST, PUT, DELETE } from '$lib/api/client';
import type { components } from '$lib/api/v1';
import { type ErrorResponse } from '$lib/api/errors';
import { ApiError } from '$lib/api/errors';

// Define types from API schema
type Paste = components['schemas']['models.Paste'];
type CreatePasteRequest = components['schemas']['models.CreatePasteRequest'];
type UpdatePasteRequest = components['schemas']['models.UpdatePasteRequest'];

type PasteResponse = components['schemas']['models.APIResponse-models_PasteData'];
type PasteListResponse = components['schemas']['models.APIResponse-models_PasteListData'];
type PasteDeleteResponse = components['schemas']['models.APIResponse-uint64'];

// Pastes store state
interface PastesState extends BaseApiState {
	pastes: Paste[];
	currentPaste: Paste | null | undefined;
}

// Create the pastes store
function createPastesStore() {
	// Add this function inside createPastesStore before the return statement
	function mergePastes(existingPastes: Paste[], newPastes: Paste[]): Paste[] {
		// Create a map of existing pastes by id for quick lookup
		const pasteMap = new Map<number, Paste>();

		// Add all existing pastes to the map
		existingPastes.forEach((paste) => {
			pasteMap.set(paste.id, paste);
		});

		// Add or update with new pastes
		newPastes.forEach((paste) => {
			pasteMap.set(paste.id, paste);
		});

		// Convert the map back to an array
		return Array.from(pasteMap.values());
	}

	const store = createBaseStore<PastesState>({
		pastes: [],
		currentPaste: null,
		loading: false,
		error: null
	});

	return {
		...store,
		async fetchAllPublicPastes(page?: number, limit?: number) {
			store.setLoading(true);
			try {
				const response = await GET('/paste/all', {
					params: {
						query: { page, limit }
					}
				});
				if (response.error) {
					const errorData = response.error as ErrorResponse;
					// TODO: add status to backend type
					const status = response.error?.status || 500;
					throw new ApiError(errorData, status);
				}
				const data = response.data as PasteListResponse;
				if (data && data.data) {
					store.update((state) => ({
						...state,
						pastes: mergePastes(state.pastes, data?.data?.pastes || []),
						loading: false
					}));
				}
			} catch (err) {
				store.setError(err);
			}
		},

		async fetchAllPrivatePastes(accessIds: string[]) {
			store.setLoading(true);
			try {
				const response = await POST('/paste/private/batch', {
					body: { accessIds: accessIds.join(',') }
				});
				if (response.error) {
					const errorData = response.error as ErrorResponse;
					// TODO: add status to backend type
					const status = response.error?.status || 500;
					throw new ApiError(errorData, status);
				}
				const data = response.data as PasteListResponse;
				if (data && data.data) {
					store.update((state) => ({
						...state,
						pastes: mergePastes(state.pastes, data?.data?.pastes || []),
						loading: false
					}));
				}
			} catch (err) {
				store.setError(err);
			}
		},
		async fetchPrivatePaste(accessId: string, pw: string | null): Promise<Paste | null> {
			store.setLoading(true);
			try {
				const response = await GET('/paste/private/{accessId}', {
					params: {
						path: { accessId },
						...(pw !== null ? { query: { pw } } : {})
					}
				});
				if (response.error) {
					const errorData = response.error as ErrorResponse;
					// TODO: add status to backend type
					const status = response.error?.status || 500;
					throw new ApiError(errorData, status);
				}

				const data = response.data as PasteResponse;
				if (data && data.data && data.data.paste) {
					store.update((state) => ({
						...state,
						currentPaste: data?.data?.paste,
						loading: false
					}));

					return data.data.paste;
				}
				return null;
			} catch (err) {
				console.log('err-catch', err);
				store.setError(err);
				throw err;
			}
		},

		async fetchPaste(id: number, pw: string | null): Promise<Paste | null> {
			store.setLoading(true);
			try {
				const response = await GET('/paste/{id}', {
					params: {
						path: { id },
						...(pw !== null ? { query: { pw } } : {})
					}
				});
				if (response.error) {
					const errorData = response.error as ErrorResponse;
					// TODO: add status to backend type
					const status = response.error?.status || 500;
					throw new ApiError(errorData, status);
				}

				const data = response.data as PasteResponse;
				if (data && data.data && data.data.paste) {
					store.update((state) => ({
						...state,
						currentPaste: data?.data?.paste,
						loading: false
					}));
					return data.data.paste;
				}
				return null;
			} catch (err) {
				console.log('err-catch', err);
				store.setError(err);
				throw err;
			}
		},

		async createPaste(pasteData: CreatePasteRequest): Promise<Paste | null> {
			store.setLoading(true);
			try {
				const response = await POST('/paste', {
					body: pasteData
				});
				if (response.error) {
					const errorData = response.error as ErrorResponse;
					// TODO: add status to backend type
					const status = response.error?.status || 500;
					throw new ApiError(errorData, status);
				}

				console.log('create', response);

				const data = response.data as PasteResponse;
				if (data && data.data && data.data.paste) {
					store.update((state) => ({
						...state,
						pastes: [...state.pastes, data.data.paste],
						currentPaste: data?.data?.paste,
						loading: false
					}));
					return data.data.paste;
				}
				return null;
			} catch (err) {
				store.setError(err);
				throw err;
			}
		},

		async updatePaste(paste: UpdatePasteRequest) {
			store.setLoading(true);
			try {
				const response = await PUT('/paste', {
					body: paste
				});
				if (response.error) {
					const errorData = response.error as ErrorResponse;
					// TODO: add status to backend type
					const status = response.error?.status || 500;
					throw new ApiError(errorData, status);
				}

				const data = response.data as PasteResponse;
				if (data && data.data && data.data.paste) {
					store.update((state) => ({
						...state,
						pastes: state.pastes.map((p) => (p.id === data.data?.paste?.id ? data.data.paste : p)),
						currentPaste: data?.data?.paste,
						loading: false
					}));
					return data.data.paste;
				}
				return null;
			} catch (err) {
				store.setError(err);
				throw err;
			}
		},

		async deletePaste(id: number) {
			store.setLoading(true);
			try {
				const response = await DELETE('/paste', {
					params: {
						path: { id }
					}
				});
				if (response.error) {
					const errorData = response.error as ErrorResponse;
					// TODO: add status to backend type
					const status = response.error?.status || 500;
					throw new ApiError(errorData, status);
				}

				const data = response.data as PasteDeleteResponse;
				store.update((state) => ({
					...state,
					pastes: state.pastes.filter((p) => p.id !== id),
					currentPaste: state.currentPaste?.id === id ? null : state.currentPaste,
					loading: false
				}));
				return data.data;
			} catch (err) {
				store.setError(err);
				throw err;
			}
		}
	};
}

// Create store instance
export const pastesStore = createPastesStore();

// Derived stores
export const pastes = derived(pastesStore, ($store) => $store.pastes);
export const currentPaste = derived(pastesStore, ($store) => $store.currentPaste);
export const pastesLoading = derived(pastesStore, ($store) => $store.loading);
export const pastesError = derived(pastesStore, ($store) => $store.error);
