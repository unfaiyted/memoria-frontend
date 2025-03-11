<script lang="ts">
	import BigPasteButton from '$lib/components/paste/BigPasteButton.svelte';
	import Icon from '$lib/components/utils/Icon.svelte';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup, LightSwitch } from '@skeletonlabs/skeleton';

	// import { setMode, getMode } from '@skeletonlabs/skeleton';

	// For theme toggle state
	let darkMode = true;

	function toggleTheme() {
		darkMode = !darkMode;
		// setMode(darkMode ? 'dark' : 'light');
	}

	const settingsPopupSettings: PopupSettings = {
		event: 'click',
		target: 'settingsPopup',
		placement: 'bottom-end'
	};
</script>

<div class="container mx-auto p-4">
	<!-- Navbar with settings button -->
	<header class="flex justify-end p-4">
		<span
			class="text-xl cursor-pointer hover:text-primary-500 hover:scale-110 active:scale-95 active:text-secondary-500 transition-all duration-200"
			use:popup={settingsPopupSettings}><Icon selected="cog" /></span
		>
		<span class="sr-only">Settings</span>
	</header>

	<!-- Hero section with CTA -->
	<div class="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-10">
		<div class="space-y-4">
			<Icon selected="code" />
			<h1 class="h2 text-primary-500">
				<div class="flex flex-row justify-center items-center">Memoria</div>
			</h1>
			<h2 class="h1 text-secondary-500">Share Code Instantly</h2>
			<p class="text-xl max-w-md mx-auto">A simple and secure way to share snippets</p>
		</div>

		<!-- CTA Card -->
		<div class="card p-10 variant-glass-surface w-full max-w-2xl">
			<a href="/new"><BigPasteButton /></a>
		</div>

		<p class="text-surface-400">No account required. Just paste and share.</p>
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

<!-- Settings Popup -->
<div class="card p-4 w-64 shadow-xl" data-popup="settingsPopup">
	<header class="text-center mb-4">
		<h3 class="h3">Settings</h3>
	</header>
	<div class="grid grid-cols-1 gap-4">
		<!-- Theme Toggle -->
		<div class="flex justify-between items-center">
			<span class="font-medium">Dark Mode</span>
			<label class="toggle">
				<LightSwitch />
				<span class="toggle-slider"></span>
			</label>
		</div>

		<!-- Font Size -->
		<div class="flex justify-between items-center">
			<span class="font-medium">Font Size</span>
			<select class="select select-sm w-24">
				<option value="small">Small</option>
				<option value="medium" selected>Medium</option>
				<option value="large">Large</option>
			</select>
		</div>

		<!-- Code Editor Theme -->
		<div class="flex justify-between items-center">
			<span class="font-medium">Editor Theme</span>
			<select class="select select-sm w-24">
				<option value="default" selected>Default</option>
				<option value="monokai">Monokai</option>
				<option value="github">GitHub</option>
			</select>
		</div>

		<hr class="opacity-50" />

		<!-- About -->
		<a href="/about" class="btn btn-sm variant-ghost-surface flex items-center justify-start">
			<Icon selected="info-circle" class="mr-5 translate-y-[-4px] translate-x-[-10px]" />
			About Memoria
		</a>

		<!-- Help -->
		<a
			href="https://github.com/unfaiyted/memoria"
			class="btn btn-sm variant-ghost-surface flex items-center justify-start"
		>
			<Icon selected="github" class="mr-5 translate-y-[0px] translate-x-[-8px]" />
			Github
		</a>
	</div>
	<div class="arrow bg-surface-100-800-token" />
</div>
