export function calculateTimeLeftPercentage(
	createdAt: string | Date,
	expiresAt: string | Date
): number {
	const created = new Date(createdAt);
	const expires = new Date(expiresAt);
	const now = new Date();

	const totalDuration = expires.getTime() - created.getTime();
	const elapsed = now.getTime() - created.getTime();

	// If already expired, return 0
	if (now > expires) return 0;

	// Calculate percentage of time left
	const timeLeftPercentage = 100 - (elapsed / totalDuration) * 100;

	return Math.max(0, Math.round(timeLeftPercentage));
}

export function formatTimeLeft(expiresAt: string | Date): string {
	const expires = new Date(expiresAt);
	const now = new Date();
	const timeLeftMs = expires.getTime() - now.getTime();

	// If already expired
	if (timeLeftMs <= 0) return 'Expired';

	// Calculate time units
	const seconds = Math.floor(timeLeftMs / 1000) % 60;
	const minutes = Math.floor(timeLeftMs / (1000 * 60)) % 60;
	const hours = Math.floor(timeLeftMs / (1000 * 60 * 60)) % 24;
	const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));

	// Format based on the largest significant time unit
	if (days > 0) {
		return `${days} ${days === 1 ? 'day' : 'days'} left`;
	} else if (hours > 0) {
		return `${hours} ${hours === 1 ? 'hr' : 'hrs'} left`;
	} else if (minutes > 0) {
		return `${minutes} ${minutes === 1 ? 'min' : 'mins'} left`;
	} else {
		return `${seconds} ${seconds === 1 ? 'sec' : 'secs'} left`;
	}
}
