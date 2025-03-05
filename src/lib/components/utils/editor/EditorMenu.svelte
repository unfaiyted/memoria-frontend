<!-- 		<button -->
<!-- 			on:click={() => editor.chain().focus().setColor('#958DF1').run()} -->
<!-- 			class={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''} -->
<!-- 		> -->
<!-- 			Purple -->
<!-- 		</button> -->
<!-- 	</div> -->
<!-- </div> -->

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { BubbleMenu } from '@tiptap/extension-bubble-menu';
	import { FloatingMenu } from '@tiptap/extension-floating-menu';

	let editor: Editor | null = null;
	let editorElement: HTMLDivElement;
	let bubbleMenuElement: HTMLDivElement;
	let floatingMenuElement: HTMLDivElement;

	onMount(() => {
		editor = new Editor({
			element: editorElement,
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
			content: `
				<p>
					Try to select <em>this text</em> to see what we call the bubble menu.
				</p>
				<p>
					Neat, isn't it? Add an empty paragraph to see the floating menu.
				</p>
			`
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

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
	class="bubble-menu btn-group variant-filled h-[30px] w-[200px]"
	style="display: {editor ? 'block' : 'none'}"
>
	<button
		on:click={() => editor?.chain().focus().toggleBold().run()}
		class:is-active={isBoldActive}
	>
		Bold
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleItalic().run()}
		class:is-active={isItalicActive}
	>
		Italic
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleStrike().run()}
		class:is-active={isStrikeActive}
	>
		Strike
	</button>
</div>

<div
	bind:this={floatingMenuElement}
	class="floating-menu btn-group variant-filled h-[30px]"
	style="display: {editor ? 'block' : 'none'}"
>
	<button
		on:click={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
		class:is-active={isHeading1Active}
	>
		H1
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
		class:is-active={isHeading2Active}
	>
		H2
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleBulletList().run()}
		class:is-active={isBulletListActive}
	>
		Bullet list
	</button>
</div>
<!-- {/if} -->

<div bind:this={editorElement}></div>

<style>
</style>
