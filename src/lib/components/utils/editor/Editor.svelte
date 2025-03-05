<!-- <script> -->
<!-- 	import { Color } from '@tiptap/extension-color'; -->
<!-- 	import ListItem from '@tiptap/extension-list-item'; -->
<!-- 	import TextStyle from '@tiptap/extension-text-style'; -->
<!-- 	import StarterKit from '@tiptap/starter-kit'; -->
<!-- 	import { Editor } from '@tiptap/core'; -->
<!-- 	import { onMount } from 'svelte'; -->
<!-- 	import EditorMenu from './EditorMenu.svelte'; -->
<!---->
<!-- 	let element; -->
<!-- 	let editor; -->
<!---->
<!-- 	onMount(() => { -->
<!-- 		editor = new Editor({ -->
<!-- 			element: element, -->
<!-- 			extensions: [ -->
<!-- 				Color.configure({ types: [TextStyle.name, ListItem.name] }), -->
<!-- 				TextStyle.configure({ types: [ListItem.name] }), -->
<!-- 				StarterKit -->
<!-- 			], -->
<!-- 			content: ` -->
<!--             <p> -->
<!--              Paste or type your input here...  -->
<!--             </p> -->
<!--           `, -->
<!-- 			onTransaction: () => { -->
<!-- 				// force re-render so `editor.isActive` works as expected -->
<!-- 				editor = editor; -->
<!-- 			} -->
<!-- 		}); -->
<!-- 	}); -->
<!-- </script> -->
<!---->
<!-- {#if editor} -->
<!-- 	<EditorMenu /> -->
<!-- {/if} -->
<!-- <section bind:this={element} class="bg-surface-200-700-token min-h-[200px]"></section> -->

<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { BubbleMenu } from '@tiptap/extension-bubble-menu';
	import { FloatingMenu } from '@tiptap/extension-floating-menu';

	export let value = '';
	export let autofocus = true;

	const dispatch = createEventDispatcher();
	let editor: Editor | null = null;
	let editorElement: HTMLDivElement;
	let bubbleMenuElement: HTMLDivElement;
	let floatingMenuElement: HTMLDivElement;
	let isFirstActivation = true;
	let isUpdatingFromProps = false;

	async function handleClear() {
		value = '';
	}

	async function handlePaste() {
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
				value = newContent;
				dispatch('update', newContent);
			},
			onCreate: ({ editor }) => {
				dispatch('ready', { editor });
				editor.commands.focus();
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	$: if (editor && value !== editor.getHTML()) {
		isUpdatingFromProps = true;
		// editor.commands.setContent(value);
		isUpdatingFromProps = false;
	}

	$: isBoldActive = editor?.isActive('bold') ?? false;
	$: isItalicActive = editor?.isActive('italic') ?? false;
	$: isStrikeActive = editor?.isActive('strike') ?? false;
	$: isHeading1Active = editor?.isActive('heading', { level: 1 }) ?? false;
	$: isHeading2Active = editor?.isActive('heading', { level: 2 }) ?? false;
	$: isBulletListActive = editor?.isActive('bulletList') ?? false;
</script>

<!-- {#if editor} -->
<div
	bind:this={bubbleMenuElement}
	class="bubble-menu btn-group variant-filled h-[30px]"
	style="display: {editor ? 'block' : 'none'}"
>
	<button
		on:click={() => editor?.chain().focus().toggleBold().run()}
		class:is-active={isBoldActive}
		aria-label="Bold"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...$$props}
			><path
				fill="currentColor"
				d="M6.8 19V5h5.525q1.625 0 3 1T16.7 8.775q0 1.275-.575 1.963t-1.075.987q.625.275 1.388 1.025T17.2 15q0 2.225-1.625 3.113t-3.05.887zm3.025-2.8h2.6q1.2 0 1.463-.612t.262-.888t-.262-.887t-1.538-.613H9.825zm0-5.7h2.325q.825 0 1.2-.425t.375-.95q0-.6-.425-.975t-1.1-.375H9.825z"
			/></svg
		>
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleItalic().run()}
		class:is-active={isItalicActive}
		aria-label="Italic"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...$$props}
			><path fill="currentColor" d="M5 19v-2.5h4l3-9H8V5h10v2.5h-3.5l-3 9H15V19z" /></svg
		>
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleStrike().run()}
		class:is-active={isStrikeActive}
		aria-label="Strikethrough"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...$$props}
			><path fill="currentColor" d="M2 14v-2h20v2zm8.5-4V7H5V4h14v3h-5.5v3zm0 10v-4h3v4z" /></svg
		>
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleBold().run()}
		class:is-active={isBoldActive}
		aria-label="Code Block"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...$$props}
			><path
				fill="currentColor"
				d="m8 18l-6-6l6-6l1.425 1.425l-4.6 4.6L9.4 16.6zm8 0l-1.425-1.425l4.6-4.6L14.6 7.4L16 6l6 6z"
			/></svg
		>
	</button>
</div>

<div
	bind:this={floatingMenuElement}
	class="floating-menu"
	style="display: {editor ? 'block' : 'none'}"
>
	<button
		on:click={handlePaste}
		class:is-active={isHeading1Active}
		class="chip variant-filled"
		aria-label="Paste"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...$$props}
			><path
				fill="currentColor"
				d="m18 21l-1.4-1.425L18.175 18H12v-2h6.175L16.6 14.4L18 13l4 4zm3-10h-2V5h-2v3H7V5H5v14h5v2H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.175q.275-.875 1.075-1.437T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5zm-9-6q.425 0 .713-.288T13 4t-.288-.712T12 3t-.712.288T11 4t.288.713T12 5"
			/></svg
		>
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
		class:is-active={isHeading1Active}
		class="chip variant-filled"
		aria-label="H1"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...$$props}
			><path fill="currentColor" d="M5 17V7h2v4h4V7h2v10h-2v-4H7v4zm12 0V9h-2V7h4v10z" /></svg
		>
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
		class="chip variant-filled"
		aria-label="H2"
		class:is-active={isHeading2Active}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...$$props}
			><path
				fill="currentColor"
				d="M3 17V7h2v4h4V7h2v10H9v-4H5v4zm10 0v-4q0-.825.588-1.412T15 11h4V9h-6V7h6q.825 0 1.413.588T21 9v2q0 .825-.587 1.413T19 13h-4v2h6v2z"
			/></svg
		>
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleBulletList().run()}
		class="chip variant-filled"
		class:is-active={isBulletListActive}
		aria-label="Bullet List"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...$$props}
			><path
				fill="currentColor"
				d="M9 19v-2h12v2zm0-6v-2h12v2zm0-6V5h12v2zM5 20q-.825 0-1.412-.587T3 18t.588-1.412T5 16t1.413.588T7 18t-.587 1.413T5 20m0-6q-.825 0-1.412-.587T3 12t.588-1.412T5 10t1.413.588T7 12t-.587 1.413T5 14m0-6q-.825 0-1.412-.587T3 6t.588-1.412T5 4t1.413.588T7 6t-.587 1.413T5 8"
			/></svg
		>
	</button>
</div>
<!-- {/if} -->

<div bind:this={editorElement} class="min-h-[200px] bg-surface-200-700-token"></div>

<style>
</style>
