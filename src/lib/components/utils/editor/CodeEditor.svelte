<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { EditorView } from '@codemirror/view';
	import { javascript } from '@codemirror/lang-javascript';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { LanguageSupport } from '@codemirror/language';
	import { onMount } from 'svelte';

	let {
		value = '',
		onUpdate = () => {},
		language = '' // Optional language override
	} = $props();

	// Create a ref for the CodeMirror component
	let view = $state<EditorView | null>(null);

	$effect(() => {
		if (view) {
			// Small delay to ensure the editor is fully rendered
			setTimeout(() => {
				if (view) view.focus();
			}, 100);
		}
	});

	// Detect language from content
	function detectLanguage(content: string): string {
		// Use provided language if available
		if (language) {
			return language.toLowerCase();
		}

		// Empty content
		if (!content || content.trim() === '') {
			return 'javascript';
		}

		const contentSample = content.slice(0, 1000); // Check first 1000 chars for performance

		// Python detection
		if (
			contentSample.match(/\bdef\s+\w+\s*\([^)]*\)\s*:/) || // function definitions
			contentSample.match(/\bclass\s+\w+(\s*\([^)]*\))?\s*:/) || // class definitions
			contentSample.match(/\bimport\s+[\w.]+/) || // imports
			contentSample.match(/\bfrom\s+[\w.]+\s+import\s+/) || // from imports
			(contentSample.includes(':') && contentSample.match(/^\s*\w+.*:$/m)) || // indented code with colons
			contentSample.includes('if __name__ == "__main__":') ||
			contentSample.match(/@\w+(\.\w+)?\s*(\([^)]*\))?/) // decorators
		) {
			return 'python';
		}

		// HTML detection
		if (
			contentSample.includes('<!DOCTYPE html>') ||
			contentSample.includes('<html') ||
			(contentSample.includes('<body') && contentSample.includes('</body>')) ||
			(contentSample.includes('<div') && contentSample.includes('</div>')) ||
			(contentSample.match(/<\w+>.*<\/\w+>/s) && !contentSample.includes('<?php')) // HTML tags but not PHP
		) {
			return 'html';
		}

		// PHP detection
		if (
			contentSample.includes('<?php') ||
			(contentSample.match(/\bfunction\s+\w+\s*\([^)]*\)\s*{/) && contentSample.includes('echo'))
		) {
			return 'php';
		}

		// CSS detection
		if (
			(contentSample.match(/[\.\#]\w+\s*{/) || contentSample.match(/@media\s+/)) && // selectors or media queries
			contentSample.match(/[\w-]+\s*:\s*[^;]+;/) && // property: value;
			!contentSample.match(/^\s*{/m) // not JSON
		) {
			return 'css';
		}

		// JavaScript/TypeScript detection
		if (
			contentSample.match(/\bconst\s+\w+\s*=/) ||
			contentSample.match(/\blet\s+\w+\s*=/) ||
			contentSample.match(/\bvar\s+\w+\s*=/) ||
			contentSample.match(/\bfunction\s+\w+\s*\(/) ||
			contentSample.match(/=>\s*{/) || // arrow function
			contentSample.match(/\bimport\s+(?:{\s*[\w\s,]+\s*}|\w+|\*)\s+from\s+['"]\w/) ||
			contentSample.match(/\bexport\s+(?:default\s+)?(?:function|class|const|let|var)/) ||
			contentSample.includes('React.') ||
			contentSample.includes('ReactDOM.') ||
			contentSample.includes('useState(') ||
			contentSample.includes('useEffect(')
		) {
			// Check if it's TypeScript
			if (
				contentSample.match(/:\s*(?:string|number|boolean|any|void|never)\b/) ||
				contentSample.match(/interface\s+\w+\s*{/) ||
				contentSample.match(/type\s+\w+\s*=\s*{/)
			) {
				// Check if it has JSX
				if (
					(contentSample.match(/<\w+(?:\s+\w+(?:=(?:["']\w+["']|\{\w+\}))?)*\s*\/?>/) &&
						contentSample.match(/\brender\s*\(/)) ||
					contentSample.match(/<\/\w+>/)
				) {
					return 'tsx';
				}
				return 'typescript';
			}

			// Check if it has JSX for JavaScript
			if (
				contentSample.match(/<\w+(?:\s+\w+(?:=(?:["']\w+["']|\{\w+\}))?)*\s*\/?>/) &&
				(contentSample.match(/\brender\s*\(/) || contentSample.match(/<\/\w+>/))
			) {
				return 'jsx';
			}

			return 'javascript';
		}

		// Java detection
		if (
			contentSample.match(/\bpublic\s+(?:class|interface|enum)\s+\w+/) ||
			contentSample.match(/\bprivate\s+(?:void|String|int|boolean|double|float)\s+\w+\s*\(/) ||
			contentSample.includes('System.out.println') ||
			contentSample.match(/import\s+java\.\w+\./)
		) {
			return 'java';
		}

		// Ruby detection
		if (
			contentSample.match(/\bdef\s+\w+\s*(?:\(.*\))?\s*$/) || // Method without colon
			contentSample.match(/\bclass\s+\w+(\s*<\s*\w+)?\s*$/) || // Class definition
			contentSample.match(/\bmodule\s+\w+\s*$/) ||
			contentSample.includes('puts ') ||
			contentSample.match(/do\s*\|[\w,\s]*\|\s*$/) // Ruby blocks
		) {
			return 'ruby';
		}

		// Go detection
		if (
			contentSample.match(/\bpackage\s+\w+/) ||
			contentSample.match(/\bfunc\s+\w+\s*\(/) ||
			contentSample.match(/\btype\s+\w+\s+struct\s+{/) ||
			contentSample.match(/\bimport\s+\([\s\S]*?\)/)
		) {
			return 'go';
		}

		// Rust detection
		if (
			contentSample.match(/\bfn\s+\w+\s*\(/) ||
			contentSample.match(/\blet\s+mut\s+\w+/) ||
			contentSample.match(/\bimpl\s+\w+/) ||
			contentSample.match(/\bpub\s+(?:fn|struct|enum|trait)/)
		) {
			return 'rust';
		}

		// C/C++ detection
		if (
			contentSample.match(/\#include\s+[<"]\w+\.h[">]/) ||
			contentSample.match(/\bint\s+main\s*\(/) ||
			(contentSample.match(/\bclass\s+\w+\s*{/) && contentSample.includes('public:'))
		) {
			return 'cpp';
		}

		// SQL detection
		if (
			contentSample.match(/\bSELECT\s+[\w\*]+\s+FROM\s+\w+/i) ||
			contentSample.match(/\bCREATE\s+TABLE\s+\w+/i) ||
			contentSample.match(/\bINSERT\s+INTO\s+\w+/i) ||
			contentSample.match(/\bUPDATE\s+\w+\s+SET\s+\w+/i) ||
			contentSample.match(/\bDELETE\s+FROM\s+\w+/i)
		) {
			return 'sql';
		}

		// Shell script detection
		if (
			contentSample.match(/^#!/) ||
			contentSample.match(/\becho\s+["']/) ||
			contentSample.match(/\bif\s+\[\s+.*\s+\];\s+then\b/)
		) {
			return 'shell';
		}

		// YAML detection
		if (
			contentSample.match(/^\s*[\w-]+:\s*.*$/m) &&
			!contentSample.match(/{/) &&
			(contentSample.match(/^\s*-\s+\w+/m) || contentSample.match(/^\s*\w+:\s*$/m))
		) {
			return 'yaml';
		}

		// Markdown detection
		if (
			contentSample.match(/^#{1,6}\s+/) ||
			contentSample.match(/\*{1,2}[\w\s]+\*{1,2}/) ||
			contentSample.match(/\[.+\]\(.+\)/) ||
			contentSample.match(/^>\s+/)
		) {
			return 'markdown';
		}

		// JSON detection - more robust check
		if (
			(contentSample.trim().startsWith('{') && contentSample.trim().endsWith('}')) ||
			(contentSample.trim().startsWith('[') && contentSample.trim().endsWith(']'))
		) {
			try {
				JSON.parse(contentSample.trim());
				return 'json';
			} catch (e) {
				// Not valid JSON
			}
		}

		// Default to JavaScript
		return 'javascript';
	}

	// Lazy load language support
	async function loadLanguageSupport(lang: string): Promise<LanguageSupport> {
		try {
			switch (lang) {
				case 'javascript':
					return javascript();
				case 'jsx':
					return import('@codemirror/lang-javascript').then((m) => m.javascript({ jsx: true }));
				case 'typescript':
					return import('@codemirror/lang-javascript').then((m) =>
						m.javascript({ typescript: true })
					);
				case 'tsx':
					return import('@codemirror/lang-javascript').then((m) =>
						m.javascript({ jsx: true, typescript: true })
					);
				case 'html':
					return import('@codemirror/lang-html').then((m) => m.html());
				case 'css':
					return import('@codemirror/lang-css').then((m) => m.css());
				case 'python':
					return import('@codemirror/lang-python').then((m) => m.python());
				case 'java':
					return import('@codemirror/lang-java').then((m) => m.java());
				case 'php':
					return import('@codemirror/lang-php').then((m) => m.php());
				case 'sql':
					return import('@codemirror/lang-sql').then((m) => m.sql());
				case 'markdown':
					return import('@codemirror/lang-markdown').then((m) => m.markdown());
				case 'xml':
					return import('@codemirror/lang-xml').then((m) => m.xml());
				case 'json':
					return import('@codemirror/lang-json').then((m) => m.json());
				case 'cpp':
					return import('@codemirror/lang-cpp').then((m) => m.cpp());
				case 'rust':
					return import('@codemirror/lang-rust').then((m) => m.rust());
				case 'go':
					return import('@codemirror/lang-go').then((m) => m.go());
				case 'ruby':
				// return import('@codemirror/lang-ruby').then((m) => m.ruby());
				case 'shell':
				// return import('@codemirror/lang-shell').then((m) => m.shell());
				case 'yaml':
					return import('@codemirror/lang-yaml').then((m) => m.yaml());
				default:
					return javascript(); // Fallback
			}
		} catch (err) {
			console.error(`Error loading language support for ${lang}:`, err);
			return javascript(); // Fallback on error
		}
	}

	let detectedLang = $state('javascript');
	let langSupport = $state(javascript());
	let isLoading = $state(false);

	// Update language when content changes
	$effect(() => {
		const newLang = detectLanguage(value);
		if (newLang !== detectedLang) {
			detectedLang = newLang;
			isLoading = true;

			loadLanguageSupport(newLang)
				.then((support) => {
					langSupport = support;
					isLoading = false;
				})
				.catch(() => {
					langSupport = javascript();
					isLoading = false;
				});
		}

		console.log(value);
		onUpdate(value, newLang);
	});
</script>

<div
	class="code-editor-container"
	onclick={(e) => {
		if (view) view.focus();
	}}
>
	<CodeMirror
		bind:value
		on:ready={(e) => (view = e.detail)}
		lang={langSupport}
		theme={oneDark}
		styles={{
			'&': {
				maxWidth: '100%',
				minHeight: '20rem',
				height: 'auto'
			}
		}}
	/>

	{#if isLoading}
		<div class="language-loading">Loading language support...</div>
	{/if}
	<div class="language-indicator">
		Language: {detectedLang}
	</div>
</div>

<style>
	.code-editor-container {
		position: relative;
	}

	.language-loading {
		position: absolute;
		top: 4px;
		right: 4px;
		background: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 12px;
	}

	.language-indicator {
		position: absolute;
		bottom: 4px;
		right: 4px;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 11px;
	}
</style>
