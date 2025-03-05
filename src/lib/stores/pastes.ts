import { derived } from 'svelte/store';
import { createBaseStore, type BaseApiState } from './base';
import { GET, POST, PUT, DELETE } from '$lib/api/client';
import type { components } from '$lib/api/v1';

// Define types from API schema
type Paste = components['schemas']['models.Paste'];
type CreatePasteRequest = components['schemas']['models.CreatePasteRequest'];
type UpdatePasteRequest = components['schemas']['models.UpdatePasteRequest'];
type PasteResponse = components['schemas']['models.PasteResponse'];
type PasteListResponse = components['schemas']['models.PasteListResponse'];

// Pastes store state
interface PastesState extends BaseApiState {
	pastes: Paste[];
	currentPaste: Paste | null;
}

// Create the pastes store
function createPastesStore() {
	const store = createBaseStore<PastesState>({
		pastes: [],
		currentPaste: null,
		loading: false,
		error: null
	});

	return {
		...store,
		async fetchAllPastes(page?: number, limit?: number) {
			store.setLoading(true);
			try {
				const response = await GET('/paste/all', {
					params: {
						query: { page, limit }
					}
				});
				if (response.error) throw response.error;

				const data = response.data as PasteListResponse;
				if (data && data.data) {
					store.update((state) => ({
						...state,
						pastes: data.data || [],
						loading: false
					}));
				}
			} catch (err) {
				store.setError(err);
			}
		},

		async fetchPaste(id: number) {
			store.setLoading(true);
			try {
				const response = await GET('/paste/{id}', {
					params: {
						path: { id }
					}
				});
				if (response.error) throw response.error;

				const data = response.data as PasteResponse;
				if (data && data.data) {
					store.update((state) => ({
						...state,
						currentPaste: data.data || null,
						loading: false
					}));
					return data.data;
				}
			} catch (err) {
				store.setError(err);
				throw err;
			}
		},

		async createPaste(pasteData: Omit<CreatePasteRequest, 'id'>) {
			store.setLoading(true);
			try {
				const response = await POST('/paste', {
					body: pasteData
				});
				if (response.error) throw response.error;

				const data = response.data as PasteResponse;
				if (data && data.data) {
					store.update((state) => ({
						...state,
						pastes: [...state.pastes, data.data as Paste],
						currentPaste: data.data || null,
						loading: false
					}));
					return data.data;
				}
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
				if (response.error) throw response.error;

				const data = response.data as PasteResponse;
				if (data && data.data) {
					store.update((state) => ({
						...state,
						pastes: state.pastes.map((p) => (p.id === data.data?.id ? (data.data as Paste) : p)),
						currentPaste: data.data || null,
						loading: false
					}));
					return data.data;
				}
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
				if (response.error) throw response.error;

				store.update((state) => ({
					...state,
					pastes: state.pastes.filter((p) => p.id !== id),
					currentPaste: state.currentPaste?.id === id ? null : state.currentPaste,
					loading: false
				}));
				return response.data?.data;
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
