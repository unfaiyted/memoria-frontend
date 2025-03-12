<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import { NodeViewContent, NodeViewWrapper } from 'svelte-tiptap';

	// Props
	let { node, updateAttributes, extension }: NodeViewProps = $props();
</script>

<NodeViewWrapper class="code-block">
	<!-- <select value={selectedLanguage}> -->
	<!-- 	<option value={null}> auto </option> -->
	<!-- 	<option disabled> — </option> -->
	<!-- 	{#each languages as language} -->
	<!-- 		<option value={language}> -->
	<!-- 			{language} -->
	<!-- 		</option> -->
	<!-- 	{/each} -->
	<!-- </select> -->
	<div
		class="codeblock overflow-hidden shadow bg-neutral-900/90 text-sm text-white rounded-container-token shadow"
		data-testid="codeblock"
	>
		<header
			class="codeblock-header text-xs text-white/50 uppercase flex justify-between items-center pr-4 pt-2 pl-4"
		>
			<span class="codeblock-language">JS</span>
			<!-- <button type="button" class="codeblock-btn btn btn-sm variant-soft !text-white">Copy</button> -->
		</header>
		<pre class="!mt-0"><code class="codeblock-code">
	<NodeViewContent />
	</code></pre>
	</div>
</NodeViewWrapper>

<style>
</style>
