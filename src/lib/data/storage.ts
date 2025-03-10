// src/lib/storage.ts
export interface StorageService {
	addPasteAccessId(id: string): void;
	getPasteAccessIds(): string[];
	clearPasteAccessIds(): void;
	hasPasteAccessId(id: string): boolean;
	removeAccessId(id: string): void;
}

export class LocalStorageService implements StorageService {
	private readonly storageKey = 'user-paste-history';

	constructor() {
		// Ensure localStorage is available (it will be in the browser but not during SSR)
		if (typeof window === 'undefined' || !window.localStorage) {
			console.warn('LocalStorage is not available');
		}
	}

	addPasteAccessId(id: string): void {
		if (typeof window === 'undefined') return;

		const ids = this.getPasteAccessIds();

		// Only add if not already in the list
		if (!ids.includes(id)) {
			ids.push(id);
			localStorage.setItem(this.storageKey, JSON.stringify(ids));
		}
	}

	getPasteAccessIds(): string[] {
		if (typeof window === 'undefined') return [];

		const storedIds = localStorage.getItem(this.storageKey);
		return storedIds ? JSON.parse(storedIds) : [];
	}

	clearPasteAccessIds(): void {
		if (typeof window === 'undefined') return;

		localStorage.removeItem(this.storageKey);
	}

	removeAccessId(id: string): void {
		if (typeof window === 'undefined') return;
		const ids = this.getPasteAccessIds().filter((existingId) => existingId !== id);
		localStorage.setItem(this.storageKey, JSON.stringify(ids));
	}

	hasPasteAccessId(id: string): boolean {
		return this.getPasteAccessIds().includes(id);
	}
}

// Create a singleton instance
export const pasteStorage = new LocalStorageService();
