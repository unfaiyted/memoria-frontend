<script lang="ts">
	import { onMount } from 'svelte';
	import { copyToClipboard } from '$lib/utils/helpers';
	import { formatTimeLeft, calculateTimeLeftPercentage } from '$lib/utils/time';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import DOMPurify from 'dompurify';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import type { Paste } from '$lib/api/types';
	import { debounce } from '$lib/utils/helpers';
	import { parseHtmlWithCodeBlocksRegex } from '$lib/utils/parsing';

	interface PasteViewProps {
		paste: Paste;
	}

	let { paste }: PasteViewProps = $props();

	let scrollDistance = $state(0);
	let isScrolled = $state(false);

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 200;
			scrollDistance = window.scrollY - 125;
		};

		const deboucedHandleScroll = debounce(handleScroll, 10);

		window.addEventListener('scroll', deboucedHandleScroll);
		return () => window.removeEventListener('scroll', deboucedHandleScroll);
	});
</script>

<div class="card variant-ghost-surface shadow-xl relative">
	<!-- Float button -->
	<button
		class="btn-icon variant-filled-secondary float-button {scrollDistance < 225 &&
		paste.editorType == 'code'
			? 'hidden'
			: ''}"
		style={isScrolled ? `top: calc(1rem + ${scrollDistance}px);` : ''}
		title="Copy to clipboard"
		aria-label="Copy to clipboard"
		onclick={() => copyToClipboard(paste.content)}
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M5 22q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Zm4-4q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Zm0-2h9V4H9v12Zm0 0V4v12Z"
			/>
		</svg>
	</button>
	<!-- Card Header with metadata -->
	<header
		class="card-header p-6 flex flex-col sm:flex-row justify-items-start text-center sm:text-left gap-4"
	>
		<div class="space-y-4 flex-1 flex flex-col sm:flex-row sm:justify-start">
			<div
				class="space-y-4 flex flex-col sm:flex-row sm:items-center justify-between order-2 w-full"
			>
				<h2 class="h2 font-bold pt-3 sm:pt-0 sm:pl-4">{paste.title}</h2>
				<div class="chip variant-soft-primary cursor-default max-h-8">
					<span>Creator: {paste.user_id || 'Anonymous'}</span>
				</div>
			</div>
			<div class="flex flex-wrap gap-3 order-1 mx-auto sm:mx-0 sm:max-w-30">
				{#if paste.createdAt && paste.expiresAt}
					<div>
						<ProgressRadial
							value={calculateTimeLeftPercentage(paste.createdAt, paste.expiresAt)}
							width="w-24"
							stroke={50}
							meter="stroke-primary-500"
							track="stroke-primary-500/30"
						>
							{formatTimeLeft(paste.expiresAt)}
						</ProgressRadial>
					</div>
				{/if}
			</div>
		</div>
	</header>

	<hr class="opacity-50" />

	<!-- Content display, with HTML parsing or code block depending on type -->
	<div class="p-0">
		<!-- For regular content that might contain HTML -->
		<div class="paste-card card p-1 md:p-6 variant-filled-surface rounded-t-none rounded-md">
			<div class="prose dark:prose-invert max-w-none marker:text-white">
				{#if paste.editorType === 'code'}
					<CodeBlock language={paste.syntaxHighlight || 'javascript'} code={paste.content} />
				{:else}
					{#each parseHtmlWithCodeBlocksRegex(paste.content) as segment}
						{#if segment.type === 'text'}
							{@html DOMPurify.sanitize(segment.content)}
						{:else if segment.type === 'code'}
							<CodeBlock language={segment.language} code={segment.content} />
						{/if}
					{/each}

					<!-- {@html DOMPurify.sanitize($currentPaste.content)} -->
				{/if}
			</div>
		</div>
		<!-- {/if} -->
	</div>
</div>

<style>
	.float-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 10;
		transition: all 0.3s ease;
	}
	@media (min-width: 768px) {
		.float-button {
			top: 1rem;
			right: 2.5rem;
		}
	}
</style>
