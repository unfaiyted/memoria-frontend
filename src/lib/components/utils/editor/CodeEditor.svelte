<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';
	import { oneDark } from '@codemirror/theme-one-dark';

	let { value = '', onUpdate = () => {} } = $props();

	$effect(() => {
		console.log(value);
		onUpdate(value);
	});
</script>

<CodeMirror
	bind:value
	lang={javascript()}
	theme={oneDark}
	styles={{
		'&': {
			// width: '500px',
			maxWidth: '100%',
			minHeight: '5rem',
			height: '20rem'
		}
	}}
/>
