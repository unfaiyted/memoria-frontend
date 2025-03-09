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
