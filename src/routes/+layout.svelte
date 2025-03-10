<script lang="ts">
	import '../app.postcss';
	import { gsap } from 'gsap';
	import { navigating } from '$app/stores';
	import NewPasteModel from '$lib/components/NewPasteModel.svelte';

	// Existing imports
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml';
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	// Additional language imports
	import python from 'highlight.js/lib/languages/python';
	import java from 'highlight.js/lib/languages/java';
	import php from 'highlight.js/lib/languages/php';
	import sql from 'highlight.js/lib/languages/sql';
	import markdown from 'highlight.js/lib/languages/markdown';
	import json from 'highlight.js/lib/languages/json';
	import cpp from 'highlight.js/lib/languages/cpp';
	import rust from 'highlight.js/lib/languages/rust';
	import go from 'highlight.js/lib/languages/go';
	import ruby from 'highlight.js/lib/languages/ruby';
	import bash from 'highlight.js/lib/languages/bash'; // For shell
	import yaml from 'highlight.js/lib/languages/yaml';
	import jsx from 'highlight.js/lib/languages/javascript'; // JSX is handled by javascript with options
	import lua from 'highlight.js/lib/languages/lua';
	import powershell from 'highlight.js/lib/languages/powershell';
	import svelte from '$lib/types/lang-svelte';

	// Register highlight.js languages
	hljs.registerLanguage('xml', xml);
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);

	// Register additional languages
	hljs.registerLanguage('python', python);
	hljs.registerLanguage('java', java);
	hljs.registerLanguage('php', php);
	hljs.registerLanguage('sql', sql);
	hljs.registerLanguage('markdown', markdown);
	hljs.registerLanguage('json', json);
	hljs.registerLanguage('cpp', cpp);
	hljs.registerLanguage('rust', rust);
	hljs.registerLanguage('go', go);
	hljs.registerLanguage('ruby', ruby);
	hljs.registerLanguage('bash', bash); // Register as 'bash' for shell scripts
	hljs.registerLanguage('shell', bash); // Also register as 'shell' for compatibility
	hljs.registerLanguage('yaml', yaml);
	hljs.registerLanguage('html', xml); // HTML is typically handled by XML highlighter
	hljs.registerLanguage('jsx', jsx); // JSX uses javascript highlighter
	hljs.registerLanguage('tsx', typescript); // TSX uses typescript highlighter
	hljs.registerLanguage('svelte', svelte); // TSX uses typescript highlighter
	hljs.registerLanguage('lua', lua);
	hljs.registerLanguage('powershell', powershell);

	storeHighlightJs.set(hljs);
	import 'highlight.js/styles/github-dark.css';

	import { initializeStores, Toast, Modal, type ModalComponent } from '@skeletonlabs/skeleton';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

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

	const modalRegistry: Record<string, ModalComponent> = {
		// Set a unique modal ID, then pass the component reference
		newPasteModel: { ref: NewPasteModel }
		// ...
	};

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
		class={`w-[${sidebarOpen ? '280px' : '50px'}] transition-all min-v-screen z-50 duration-300 h-dvh ${sidebarOpen ? '' : '-translate-x-[0px]'}`}
	>
		<Sidebar isOpen={sidebarOpen} onToggle={handleToggle} />
	</div>
	<main class={`overflow-y-auto  z-10 transition-all duration-300 w-full max-w-[1200px]`}>
		<div bind:this={pageContainer}>
			<slot />
		</div>
	</main>
</div>
<Modal components={modalRegistry} />
