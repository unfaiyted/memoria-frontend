import type { ToastStore } from '@skeletonlabs/skeleton';
/**
 * OS detection utility functions
 */

export enum OperatingSystem {
	Windows = 'Windows',
	MacOS = 'MacOS',
	iOS = 'iOS',
	Android = 'Android',
	Linux = 'Linux',
	Unknown = 'Unknown'
}

export type OSKeys = keyof typeof OperatingSystem;

export enum DeviceType {
	Mobile = 'Mobile',
	Tablet = 'Tablet',
	Desktop = 'Desktop'
}

export const detectOS = (): OperatingSystem => {
	const userAgent = navigator.userAgent;

	if (/Windows/i.test(userAgent)) return OperatingSystem.Windows;
	if (/Macintosh|Mac OS X/i.test(userAgent)) return OperatingSystem.MacOS;
	if (/iPad|iPhone|iPod/i.test(userAgent)) return OperatingSystem.iOS;
	if (/Android/i.test(userAgent)) return OperatingSystem.Android;
	if (/Linux/i.test(userAgent)) return OperatingSystem.Linux;

	return OperatingSystem.Unknown;
};

export const isMobile = (): boolean => {
	// Check for common mobile user agent patterns
	const userAgent = navigator.userAgent;
	if (/(Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i.test(userAgent)) {
		return true;
	}

	// Alternative check based on screen size (optional)
	return window.innerWidth <= 768;
};

export const getDeviceType = (): DeviceType => {
	const userAgent = navigator.userAgent;

	// Tablets
	if (/iPad|tablet|Tablet/i.test(userAgent)) {
		return DeviceType.Tablet;
	}

	// Mobile devices
	if (/(iPhone|iPod|Android.*Mobile|BlackBerry|IEMobile)/i.test(userAgent)) {
		return DeviceType.Mobile;
	}

	// Default to desktop
	return DeviceType.Desktop;
};

// Example usage
export const getBrowserInfo = () => {
	return {
		os: detectOS(),
		isMobile: isMobile(),
		deviceType: getDeviceType(),
		userAgent: navigator.userAgent,
		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight
	};
};

// Copy paste content to clipboard
export async function copyToClipboard(content: string, toastStore: ToastStore): Promise<void> {
	if (!content || content === '') return;

	try {
		await navigator.clipboard.writeText(content);
		toastStore.trigger({
			message: 'Copied to clipboard!',
			background: 'variant-filled-success'
		});
	} catch (err: unknown) {
		toastStore.trigger({
			message: 'Failed to copy to clipboard',
			background: 'variant-filled-error'
		});
	}
}

export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return function (...args: Parameters<T>): void {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			func(...args);
		}, wait);
	};
}
