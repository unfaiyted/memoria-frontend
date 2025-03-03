<script>
	import { Color } from '@tiptap/extension-color';
	import ListItem from '@tiptap/extension-list-item';
	import TextStyle from '@tiptap/extension-text-style';
	import StarterKit from '@tiptap/starter-kit';
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';

	let element;
	let editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				Color.configure({ types: [TextStyle.name, ListItem.name] }),
				TextStyle.configure({ types: [ListItem.name] }),
				StarterKit
			],
			content: `
            <p>
             Paste or type your input here... 
            </p>
          `,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});
</script>

{#if editor}
	<div
		class="previewer-header bg-surface-200-700-token p-4 flex justify-between items-center gap-4 card-header"
	>
		<div class="btn-group btn-sm variant-filled overflow-x-auto">
			<button
				on:click={() => console.log && editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				class={editor.isActive('bold') ? 'is-active' : ''}
			>
				Bold
			</button>
			<button
				on:click={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				class={editor.isActive('italic') ? 'is-active' : ''}
			>
				Italic
			</button>
			<button
				on:click={() => editor.chain().focus().toggleStrike().run()}
				disabled={!editor.can().chain().focus().toggleStrike().run()}
				class={editor.isActive('strike') ? 'is-active' : ''}
			>
				Strike
			</button>
			<!-- <button -->
			<!-- 	on:click={() => editor.chain().focus().toggleCode().run()} -->
			<!-- 	disabled={!editor.can().chain().focus().toggleCode().run()} -->
			<!-- 	class={editor.isActive('code') ? 'is-active' : ''} -->
			<!-- > -->
			<!-- 	Code -->
			<!-- </button> -->
			<button on:click={() => editor.chain().focus().unsetAllMarks().run()}>Clear marks</button>
			<button on:click={() => editor.chain().focus().clearNodes().run()}>Clear nodes</button>
			<button
				on:click={() => editor.chain().focus().setParagraph().run()}
				class={editor.isActive('paragraph') ? 'is-active' : ''}
			>
				Paragraph
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				class={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
			>
				H1
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				class={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
			>
				H2
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				class={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
			>
				H3
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
				class={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
			>
				H4
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
				class={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
			>
				H5
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
				class={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
			>
				H6
			</button>
			<button
				on:click={() => editor.chain().focus().toggleBulletList().run()}
				class={editor.isActive('bulletList') ? 'is-active' : ''}
			>
				Bullet list
			</button>
			<button
				on:click={() => editor.chain().focus().toggleOrderedList().run()}
				class={editor.isActive('orderedList') ? 'is-active' : ''}
			>
				Ordered list
			</button>
			<button
				on:click={() => editor.chain().focus().toggleCodeBlock().run()}
				class={editor.isActive('codeBlock') ? 'is-active' : ''}
			>
				Code block
			</button>
			<button
				on:click={() => editor.chain().focus().toggleBlockquote().run()}
				class={editor.isActive('blockquote') ? 'is-active' : ''}
			>
				Blockquote
			</button>
			<button on:click={() => editor.chain().focus().setHorizontalRule().run()}>
				Horizontal rule
			</button>
			<button on:click={() => editor.chain().focus().setHardBreak().run()}>Hard break</button>
			<!-- <button -->
			<!-- 	on:click={() => editor.chain().focus().undo().run()} -->
			<!-- 	disabled={!editor.can().chain().focus().undo().run()} -->
			<!-- > -->
			<!-- 	Undo -->
			<!-- </button> -->
			<!-- <button -->
			<!-- 	on:click={() => editor.chain().focus().redo().run()} -->
			<!-- 	disabled={!editor.can().chain().focus().redo().run()} -->
			<!-- > -->
			<!-- 	Redo -->
			<!-- </button> -->
			<button
				on:click={() => editor.chain().focus().setColor('#958DF1').run()}
				class={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
			>
				Purple
			</button>
		</div>
	</div>
{/if}
<section bind:this={element} class=" bg-surface-800"></section>
