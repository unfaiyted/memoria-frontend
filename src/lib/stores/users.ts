import { derived } from 'svelte/store';
import { createBaseStore, client, type BaseApiState } from './base';
import type { UserResponse, User } from '$lib/api/types';

// Users store state
interface UsersState extends BaseApiState {
	users: UserResponse[];
}

// Create the users store
function createUsersStore() {
	const store = createBaseStore<UsersState>({
		users: [],
		loading: false,
		error: null
	});

	return {
		...store,
		async fetchUsers() {
			store.setLoading(true);
			try {
				const { data, error } = await client.GET('/users');
				if (error) throw error;
				if (data) {
					store.update((state) => ({ ...state, users: data, loading: false }));
				}
			} catch (err) {
				store.setError(err);
			}
		},

		async createUser(user: User) {
			store.setLoading(true);
			try {
				const { data, error } = await client.POST('/users', { body: user });
				if (error) throw error;
				if (data) {
					store.update((state) => ({
						...state,
						users: [...state.users, data],
						loading: false
					}));
					return data;
				}
			} catch (err) {
				store.setError(err);
				throw err;
			}
		},

		async updateUser(id: number, user: User) {
			store.setLoading(true);
			try {
				const { data, error } = await client.PUT('/users/{id}', {
					params: { path: { id } },
					body: user
				});
				if (error) throw error;
				if (data) {
					store.update((state) => ({
						...state,
						users: state.users.map((u) => (u.id === id ? data : u)),
						loading: false
					}));
					return data;
				}
			} catch (err) {
				store.setError(err);
				throw err;
			}
		},

		async deleteUser(id: number) {
			store.setLoading(true);
			try {
				const { error } = await client.DELETE('/users/{id}', {
					params: { path: { id } }
				});
				if (error) throw error;
				store.update((state) => ({
					...state,
					users: state.users.filter((u) => u.id !== id),
					loading: false
				}));
			} catch (err) {
				store.setError(err);
				throw err;
			}
		}
	};
}

// Create store instance
export const usersStore = createUsersStore();

// Derived stores
export const users = derived(usersStore, ($store) => $store.users);
export const usersLoading = derived(usersStore, ($store) => $store.loading);
export const usersError = derived(usersStore, ($store) => $store.error);
