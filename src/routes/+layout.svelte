<script lang="ts">
	import '../app.postcss';
	import { gsap } from 'gsap';
	import { navigating } from '$app/stores';

	// Existing imports
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml';
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	import { initializeStores, Toast } from '@skeletonlabs/skeleton';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	// Register highlight.js languages
	hljs.registerLanguage('xml', xml);
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	initializeStores();

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	let sidebarOpen = true;
	let pageContainer: HTMLElement;

	function handleToggle(e: CustomEvent<{ isOpen: boolean }>) {
		sidebarOpen = e.detail.isOpen;
	}

	// Page transition logic with GSAP
	$: if ($navigating) {
		// Page exit animation
		gsap.to(pageContainer, {
			opacity: 0,
			y: -50,
			duration: 0.4,
			ease: 'power1.out'
		});
	} else if (pageContainer) {
		// Page enter animation
		gsap.fromTo(
			pageContainer,
			{ opacity: 0, y: 50 },
			{ opacity: 1, y: 0, duration: 0.4, ease: 'power1.out' }
		);
	}
</script>

<div class="flex min-h-screen overflow-hidden">
	<Toast />
	<div
		class={`w-[${sidebarOpen ? '280px' : '50px'}] transition-all min-v-screen z-50 duration-300 ${sidebarOpen ? '' : '-translate-x-[0px]'}`}
	>
		<Sidebar isOpen={sidebarOpen} onToggle={handleToggle} />
	</div>
	<main
		class={`overflow-y-auto flex-1 z-10 transition-all flex item-center duration-300 max-w-[900px]`}
	>
		<div bind:this={pageContainer}>
			<slot />
		</div>
	</main>
</div>
