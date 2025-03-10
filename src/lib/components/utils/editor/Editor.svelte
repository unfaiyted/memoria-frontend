<script lang="ts">
	import Icon from '$lib/components/utils/Icon.svelte';
	import { onMount, onDestroy } from 'svelte';
	import CodeBlock from './CodeBlock.svelte';
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import { all, createLowlight } from 'lowlight';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { BubbleMenu } from '@tiptap/extension-bubble-menu';
	import { FloatingMenu } from '@tiptap/extension-floating-menu';

	import 'highlight.js/styles/github-dark.css';

	import xml from 'highlight.js/lib/languages/xml';
	import css from 'highlight.js/lib/languages/css';
	import js from 'highlight.js/lib/languages/javascript';
	import ts from 'highlight.js/lib/languages/typescript';
	import html from 'highlight.js/lib/languages/xml';
	import { SvelteNodeViewRenderer } from 'svelte-tiptap';

	const lowlight = createLowlight(all);

	lowlight.register('html', html);
	lowlight.register('css', css);
	lowlight.register('js', js);
	lowlight.register('ts', ts);
	lowlight.register('xml', xml);

	let { value = '', autofocus = true, onUpdate = () => {}, onReady = () => {} } = $props();

	let editor = $state<Editor | null>(null);
	let editorElement = $state<HTMLDivElement>();
	let bubbleMenuElement = $state<HTMLDivElement>();
	let floatingMenuElement = $state<HTMLDivElement>();
	let isFirstActivation = $state(true);
	let isUpdatingFromProps = $state(false);

	async function handlePaste(e: Event) {
		e.preventDefault();
		if (!editor) return;

		try {
			const clipboardText = await navigator.clipboard.readText();
			if (clipboardText) {
				editor.chain().focus().insertContent(clipboardText).run();
			}
		} catch (error) {
			console.error('Failed to read clipboard contents:', error);
		}
	}

	onMount(() => {
		editor = new Editor({
			element: editorElement,
			autofocus: autofocus,
			extensions: [
				StarterKit,
				CodeBlockLowlight.extend({
					addNodeView() {
						return SvelteNodeViewRenderer(CodeBlock);
					}
				}).configure({ lowlight }),
				BubbleMenu.configure({
					element: bubbleMenuElement,
					tippyOptions: { duration: 100 }
				}),
				FloatingMenu.configure({
					element: floatingMenuElement,
					tippyOptions: { duration: 100 }
				})
			],
			content:
				value ||
				`
				<p class="flex h-screen">
				 <div class="m-auto">Type or Paste here</div>
				</p>
			`,
			onFocus: () => {
				if (isFirstActivation && editor) {
					editor.commands.clearContent(true);
					editor.commands.setContent('<p></p>');
					isFirstActivation = false;
				}
			},
			onUpdate: ({ editor }) => {
				if (isUpdatingFromProps) return;
				const newContent = editor.getHTML();
				onUpdate(newContent);
			},
			onCreate: ({ editor }) => {
				onReady({ editor });
				editor.commands.focus();
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	$effect(() => {
		isUpdatingFromProps = true;
		if (editor) editor.commands.setContent(value);
		onUpdate(value);
		isUpdatingFromProps = false;
	});

	const isBoldActive = $derived(editor?.isActive('bold') ?? false);
	const isItalicActive = $derived(editor?.isActive('italic') ?? false);
	const isStrikeActive = $derived(editor?.isActive('strike') ?? false);
	const isHeading1Active = $derived(editor?.isActive('heading', { level: 1 }) ?? false);
	const isHeading2Active = $derived(editor?.isActive('heading', { level: 2 }) ?? false);
	const isBulletListActive = $derived(editor?.isActive('bulletList') ?? false);
	const isCodeBlockActive = $derived(editor?.isActive('codeblock') ?? false);
</script>

<div class="card">
	<div
		bind:this={bubbleMenuElement}
		class="bubble-menu btn-group variant-filled h-[30px]"
		style="display: {editor ? 'block' : 'none'}"
	>
		<button
			onclick={(event) => {
				event.preventDefault();
				editor?.chain().focus().toggleBold().run();
			}}
			class:is-active={isBoldActive}
			aria-label="Bold"
		>
			<Icon selected="bold" />
		</button>
		<button
			onclick={(event) => {
				event.preventDefault();
				editor?.chain().focus().toggleItalic().run();
			}}
			class:is-active={isItalicActive}
			aria-label="Italic"
		>
			<Icon selected="italics" />
		</button>
		<button
			onclick={(event) => {
				event.preventDefault();
				editor?.chain().focus().toggleStrike().run();
			}}
			class:is-active={isStrikeActive}
			aria-label="Strikethrough"
		>
			<Icon selected="strike-through" />
		</button>
		<button
			onclick={(event) => {
				event.preventDefault();
				editor?.chain().focus().toggleCodeBlock().run();
			}}
			class:is-active={isCodeBlockActive}
			aria-label="Code Block"
		>
			<Icon selected="codeblock" />
		</button>
	</div>

	<div
		bind:this={floatingMenuElement}
		class="floating-menu"
		style="display: {editor ? 'block' : 'none'}"
	>
		<button
			onclick={handlePaste}
			class:is-active={isHeading1Active}
			class="chip variant-filled"
			aria-label="Paste"
		>
			<Icon selected="paste" />
		</button>
		<button
			onclick={(event) => {
				event.preventDefault();
				editor?.chain().focus().toggleCodeBlock().run();
			}}
			class:is-active={isCodeBlockActive}
			class="chip variant-filled"
			aria-label="Code Block"
		>
			<Icon selected="codeblock" />
		</button>

		<button
			onclick={(event) => {
				event.preventDefault();
				editor?.chain().focus().toggleHeading({ level: 1 }).run();
			}}
			class:is-active={isHeading1Active}
			class="chip variant-filled"
			aria-label="H1"
		>
			<Icon selected="h1" />
		</button>
		<button
			onclick={(event) => {
				event.preventDefault();
				editor?.chain().focus().toggleHeading({ level: 2 }).run();
			}}
			class="chip variant-filled"
			aria-label="H2"
			class:is-active={isHeading2Active}
		>
			<Icon selected="h2" />
		</button>
		<button
			onclick={(event) => {
				event.preventDefault();
				editor?.chain().focus().toggleBulletList().run();
			}}
			class="chip variant-filled"
			class:is-active={isBulletListActive}
			aria-label="Bullet List"
		>
			<Icon selected="bullet-list" />
		</button>
	</div>

	<div bind:this={editorElement} class="min-h-[200px] bg-surface-200-700-token"></div>
</div>

<style>
	/* Bubble menu */
	.bubble-menu {
		/* background-color: var(--white); */
		/* border: 1px solid var(--gray-1); */
		border-radius: 0.7rem;
		/* box-shadow: var(--shadow); */
		display: flex;
		padding: 0.2rem;

		button {
			background-color: unset;

			/* 	&:hover { */
			/* 		background-color: var(--gray-3); */
			/* 	} */
			/**/
			/* 	&.is-active { */
			/* 		background-color: var(--purple); */
			/**/
			/* 		&:hover { */
			/* 			background-color: var(--purple-contrast); */
			/* 		} */
			/* 	} */
		}
	}

	/* Floating menu */
	.floating-menu {
		display: flex;
		/* background-color: var(--gray-3); */
		padding: 0.1rem;
		border-radius: 0.5rem;

		button {
			/* background-color: unset; */
			padding: 0.275rem 0.425rem;
			border-radius: 0.3rem;
		}
	}
</style>
