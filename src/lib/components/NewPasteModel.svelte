<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import Icon from '$lib/components/utils/Icon.svelte';

	import { getModalStore, clipboard } from '@skeletonlabs/skeleton';
	import { copyToClipboard } from '$lib/utils/helpers';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	// Local
	const modalStore = getModalStore();

	// Add state for short URL generation
	let shortUrlGenerated = false;
	let shortUrl = '';

	// Function to generate short URL
	function generateShortUrl() {
		shortUrlGenerated = true;
		// This would typically make an API call
		shortUrl = 'https://short.url/abc123'; // Example value
		copyToClipboard(shortUrl);
	}

	// Handle Form Submission
	function onFormSubmit(): void {
		if ($modalStore?.[0]?.response) $modalStore[0]?.response(null);
		modalStore.close();
	}

	// Share to Twitter/X
	function shareToTwitter() {
		const url = $modalStore[0]?.value || '';
		const text = 'Check out this paste!';
		const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
		window.open(shareUrl, '_blank', 'noopener,noreferrer');
	}

	// Share to Facebook
	function shareToFacebook() {
		const url = $modalStore[0]?.value || '';
		const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
		window.open(shareUrl, '_blank', 'noopener,noreferrer');
	}

	// Share to LinkedIn
	function shareToLinkedIn() {
		const url = $modalStore[0]?.value || '';
		const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
		window.open(shareUrl, '_blank', 'noopener,noreferrer');
	}

	// Share via Email
	function shareViaEmail() {
		const url = $modalStore[0]?.value || '';
		const subject = 'Check out this paste';
		const body = `I wanted to share this paste with you: ${url}`;
		const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		window.location.href = mailtoUrl;
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl max-w-[400px] space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="bg-gradient-to-br variant-gradient-primary-secondary {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>

		<div class="mb-6">
			<p class="text-md mb-4 font-bold">Share directly to:</p>
			<div class="flex gap-4 justify-center">
				<button
					class="btn-icon bg-blue-100 rounded-full text-blue-400 transition-colors"
					onclick={shareToTwitter}
				>
					<Icon selected="twitter" />
				</button>
				<button
					class="btn-icon bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors"
					onclick={shareToFacebook}
				>
					<Icon selected="facebook" />
				</button>
				<button
					class="btn-icon bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full transition-colors"
					onclick={shareToLinkedIn}
				>
					<Icon selected="linkedin" />
				</button>
				<button
					class="btn-icon bg-blue-100 hover:bg-blue-200 text-red-400 rounded-full transition-colors"
					onclick={shareViaEmail}
				>
					<Icon selected="email" />
				</button>
			</div>
		</div>

		<div class="flex flex-col mb-4">
			<label class="label mb-2 text-sm" for="pasteLink">Copy link:</label>
			<div
				class="input-group input-group-divider !bg-white/20 grid-cols-[1fr_auto] !border-white/30 !drop-shadow-md"
			>
				<input
					type="text"
					name="pasteLink"
					disabled
					class="!bg-white/10"
					value={$modalStore[0].value ?? '(missing)'}
					data-clipboard="pasteLink"
				/>
				<button
					class=" border-l-2 !p-0 !border-white/40 bg-secondary-500 text-white"
					use:clipboard={{ input: 'pasteLink' }}
				>
					<Icon selected="copy-out" width="1" />
				</button>
			</div>
		</div>

		<div class="flex flex-col">
			<label class="label mb-2 text-sm" for="shortUrl">Generate short URL:</label>
			{#if !shortUrlGenerated}
				<button class="btn variant-filled-primary w-full py-2" onclick={generateShortUrl}>
					Generate Short URL
				</button>
			{:else}
				<div
					class="input-group input-group-divider !bg-white/20 grid-cols-[1fr_auto] !border-white/40 !drop-shadow-md"
				>
					<input
						type="text"
						disabled
						name="shortUrl"
						class="!bg-white/10"
						value={shortUrl}
						data-clipboard="shortUrl"
					/>
					<button
						class="border-l-2 !p-0 border-surface-400 bg-primary-500 !text-white"
						use:clipboard={{ input: 'shortUrl' }}
					>
						<Icon selected="confirm-check" width="1" />
					</button>
				</div>
			{/if}
		</div>

		<!-- prettier-ignore -->
		<footer class="modal-footer flex flex-row justify-center pt-2 {parent.regionFooter}">

        <button class="btn {parent.buttonPositive}" onclick={onFormSubmit}>View Paste</button>
    </footer>
	</div>
{/if}
