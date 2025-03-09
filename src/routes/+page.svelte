<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
	// import { Avatar } from '@skeletonlabs/skeleton';
	// Import your preferred icon component
	// If using Skeleton UI's newer versions with Icon component:
	// import { Icon } from '@skeletonlabs/skeleton';
	import Icon from '$lib/components/utils/Icon.svelte';
</script>

<div class="container mx-auto p-4">
	<!-- Navbar with settings button -->
	<header class="flex justify-end p-4">
		<!-- Replace with your preferred icon component -->
		<span class="text-xl"><Icon selected="cog" /></span>
		<span class="sr-only">Settings</span>
	</header>

	<!-- Hero section with CTA -->
	<div class="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-10">
		<div class="space-y-4">
			<h1 class="h2 text-primary-500">
				<div class="flex flex-row justify-center items-center">Memoria</div>
			</h1>
			<h2 class="h1 text-secondary-500">Share Code Instantly</h2>
			<p class="text-xl max-w-md mx-auto">
				A simple and secure way to share code snippets and text with anyone.
			</p>
		</div>

		<!-- CTA Card -->
		<div class="card card-hover p-10 variant-glass-surface w-full max-w-2xl">
			<a href="/new" class="btn btn-xl variant-filled-primary w-full py-8 text-3xl font-bold">
				Paste
			</a>
			<p class="pt-4 text-surface-400">No account required. Just paste and share.</p>
		</div>

		<!-- Feature highlights -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
			<div class="card p-4 variant-ghost-surface text-center">
				<h3 class="h3 text-secondary-500">Simple</h3>
				<p>No signup needed</p>
			</div>
			<div class="card p-4 variant-ghost-surface text-center">
				<h3 class="h3 text-secondary-500">inSecure</h3>
				<p>Public by default</p>
			</div>
			<div class="card p-4 variant-ghost-surface text-center">
				<h3 class="h3 text-secondary-500">Swift</h3>
				<p>Instant sharing</p>
			</div>
		</div>
	</div>
</div>
