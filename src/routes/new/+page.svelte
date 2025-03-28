<script lang="ts">
	import Editor from '$lib/components/utils/editor/Editor.svelte';
	import CodeEditor from '$lib/components/utils/editor/CodeEditor.svelte';
	import { onMount } from 'svelte';
	import { pastesStore } from '$lib/stores/pastes';
	import { pasteStorage } from '$lib/data/storage';
	import { goto } from '$app/navigation';
	import { popup, getToastStore, type PopupSettings } from '@skeletonlabs/skeleton';
	import { type CreatePasteRequest, type Paste } from '$lib/api/types';
	import { type ModalSettings, getModalStore } from '@skeletonlabs/skeleton';
	import Icon from '$lib/components/utils/Icon.svelte';
	import { detectOS } from '$lib/utils/helpers';
	import { OperatingSystem } from '$lib/utils/helpers';
	import Layout from '../+layout.svelte';
	import PasteLoading from '$lib/components/paste/PasteLoading.svelte';

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	// Form state
	let title = '';
	let automaticTitle = true;
	let sendContent = '';
	let selectedLanguage = '';
	let defaultContent = '';
	let syntaxHighlighting = 'text';
	let expiration = '1d'; // Default: 1 day
	let password = '';
	let isPrivate = false;
	let isLoading = false;
	let isCodeEditor = true;
	let showPassword = false;

	let osDetected = OperatingSystem.Unknown;

	// All supported languages in CodeEditor
	const supportedLanguages = [
		{ value: '', label: 'Auto-detect' },
		{ value: 'javascript', label: 'JavaScript' },
		{ value: 'jsx', label: 'JSX' },
		{ value: 'typescript', label: 'TypeScript' },
		{ value: 'tsx', label: 'TSX' },
		{ value: 'html', label: 'HTML' },
		{ value: 'css', label: 'CSS' },
		{ value: 'python', label: 'Python' },
		{ value: 'java', label: 'Java' },
		{ value: 'php', label: 'PHP' },
		{ value: 'powershell', label: 'Powershell' },
		{ value: 'sql', label: 'SQL' },
		{ value: 'markdown', label: 'Markdown' },
		{ value: 'xml', label: 'XML' },
		{ value: 'json', label: 'JSON' },
		{ value: 'cpp', label: 'C/C++' },
		{ value: 'rust', label: 'Rust' },
		{ value: 'go', label: 'Go' },
		//  Added support for Svelte, Ruby, CMake, Nginx, Dockerfile, Swift, R, PowerShell, Shell, and Lua
		{ value: 'ruby', label: 'Ruby' },
		{ value: 'shell', label: 'Shell/Bash' },
		{ value: 'yaml', label: 'YAML' },
		{ value: 'lua', label: 'Lua' },
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'cmake', label: 'CMake' },
		{ value: 'nginx', label: 'Nginx' },
		{ value: 'dockerfile', label: 'Dockerfile' },
		{ value: 'swift', label: 'Swift' },
		{ value: 'r', label: 'R' }
	];

	onMount(() => {
		osDetected = detectOS();
	});

	// Expiration options
	const expirationOptions = [
		{ value: '30m', label: '30 Minutes' },
		{ value: '1h', label: '1 Hour' },
		{ value: '1d', label: '1 Day' },
		{ value: '1w', label: '1 Week' },
		{ value: '1m', label: '1 Month' },
		{ value: 'never', label: 'Never' }
	];

	const popupClick: PopupSettings = {
		event: 'hover',
		target: 'popupClick',
		placement: 'top'
	};
	// Calculate expiration date based on selected option
	function calculateExpiresAt(option: string) {
		if (option === 'never') return undefined;

		const now = new Date();
		switch (option) {
			case '30m':
				return new Date(now.getTime() + 30 * 60000).toISOString();
			case '1h':
				return new Date(now.getTime() + 60 * 60000).toISOString();
			case '1d':
				return new Date(now.getTime() + 24 * 60 * 60000).toISOString();
			case '1w':
				return new Date(now.getTime() + 7 * 24 * 60 * 60000).toISOString();
			case '1m':
				return new Date(now.getTime() + 30 * 24 * 60 * 60000).toISOString();
			default:
				return new Date(now.getTime() + 24 * 60 * 60000).toISOString();
		}
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	async function handleUpdate(value: string, detectedLanguage: string = 'text') {
		// TODO add code editor logic here for type detection
		sendContent = value;
		syntaxHighlighting = selectedLanguage || detectedLanguage;

		if (automaticTitle) title = `A ${syntaxHighlighting} paste`;
	}

	function handleTitleFocus() {
		if (automaticTitle == true) {
			automaticTitle = false;
			title = '';
		}
	}

	// Handle form submission
	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		try {
			isLoading = true;

			// Determine privacy setting
			let privacy = isPrivate ? 'private' : 'public';

			const pasteData: CreatePasteRequest = {
				title,
				content: sendContent,
				expiresAt: calculateExpiresAt(expiration),
				privacy: privacy as 'public' | 'private',
				editorType: isCodeEditor ? 'code' : 'text',
				syntaxHighlight: syntaxHighlighting || 'text'
			};

			if (password != '') {
				pasteData.password = password;
			}

			// Create paste using the store
			const result: Paste | null = await pastesStore.createPaste(pasteData);

			if (result) {
				if (privacy === 'private' && result.privateAccessId) {
					pasteStorage.addPasteAccessId(result.privateAccessId);
				} else {
					// toastStore.trigger({
					// 	message: 'Paste missing access id ',
					// 	background: 'variant-filled-error'
					// });
				}

				const currentUrl = window.location.host;
				const currProtocol = window.location.href.split(':')[0];

				const pasteLocation =
					privacy === 'public'
						? `${currProtocol}://${currentUrl}/paste/${result.id}`
						: `${currProtocol}://${currentUrl}/paste/private/${result.privateAccessId}`;
				const modal: ModalSettings = {
					type: 'component',
					component: 'newPasteModel',
					title: 'Success',
					value: pasteLocation,
					body: 'Past created! Here is a short url for easy sharing',
					response: () => {
						if (password == '' && privacy == 'public') goto(`/paste/${result.id}`);
						if (password == '' && privacy == 'private')
							goto(`/paste/private/${result.privateAccessId}`);
						if (password != '' && privacy == 'public') goto(`/paste/${result.id}?pw=${password}`);
						if (password != '' && privacy == 'private')
							goto(`/paste/private/${result.privateAccessId}?pw=${password}`);
					}
				};

				modalStore.trigger(modal);
				// Navigate to the new paste
			}
		} catch (error) {
			toastStore.trigger({
				message: `Error creating paste: ${(error as Error).message || 'Unknown error'}`,
				background: 'variant-filled-error'
			});
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>New Paste</title>
</svelte:head>

<div class="container mx-auto p-1 sm:p-6 max-w-4xl overflow-y">
	<h2 class="h2 pb-4">Create New Paste</h2>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Content Editor -->
		<div>
			<div class="flex justify-between items-center mb-1">
				<div class="flex space-x-2">
					<!-- Buttons could be added here -->
				</div>
			</div>

			<div class="card">
				<!-- Editor with content binding -->
				<header class="pt-4 pl-4 mb-4">
					<div class="flex justify-between">
						<div class="hidden sm:block">
							Press <kbd class="kbd">
								{#if osDetected === OperatingSystem.MacOS}
									⌘ + V
								{:else}
									CTRL + V
								{/if}</kbd
							> to paste.
						</div>
						<div class="w-full flex flex-row justify-between sm:justify-end pr-4">
							<button
								class="chip variant-soft hover:variant-filled mr-2"
								onclick={(e) => {
									e.preventDefault();
									isCodeEditor = !isCodeEditor;
								}}
							>
								<span>
									{#if !isCodeEditor}
										<Icon selected="codeblock" />
									{:else}
										<Icon selected="text" />
									{/if}
								</span>
								<span>Swith Editor</span>
							</button>

							<button
								class="chip variant-soft hover:variant-filled"
								onclick={(e) => {
									e.preventDefault();
									sendContent = '';
									defaultContent = '';
								}}
							>
								<span><Icon selected="clear" /></span>
								<span>Clear</span>
							</button>
						</div>
					</div>
				</header>
				<div class="p-2 bg-surface-200-700-token">
					{#if isCodeEditor}
						<CodeEditor
							value={defaultContent}
							onUpdate={handleUpdate}
							language={selectedLanguage}
						/>
					{:else}
						<Editor value={defaultContent} onUpdate={handleUpdate} />
					{/if}
				</div>
				<footer class="card-footer border-t-2 pt-3 border-surface-700">
					<div class="flex flex-row justify-between">
						<em class="text-xs my-auto pr-4"
							>Editor can swap between code raw mode and formatted input mode</em
						>
						<label class="label">
							<span class="text-xs">Language</span>
							<select class="select" bind:value={selectedLanguage}>
								{#each supportedLanguages as lang}
									<option value={lang.value}>{lang.label}</option>
								{/each}
							</select>
						</label>
					</div>
				</footer>
			</div>
		</div>
		<!-- Title and Expiration on same line -->
		<div class="flex flex-wrap gap-4 p-2">
			<!-- Title Input -->
			<div class="flex-1 min-w-[250px]">
				<label for="title" class="label mb-1">Title</label>
				<input
					id="title"
					type="text"
					bind:value={title}
					onfocusin={handleTitleFocus}
					placeholder="Enter a title for your paste"
					class="input"
					required
				/>
			</div>

			<!-- Expiration Options -->
			<div class="w-64">
				<label for="expiration" class="label mb-1">Expires After</label>
				<select id="expiration" bind:value={expiration} class="select">
					{#each expirationOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>
		<!-- Password Protection and Privacy on same line -->
		<div class="flex flex-wrap gap-4 p-2 items-center">
			<!-- Password Protection -->
			<!-- <div class="flex-1 min-w-[250px]"> -->
			<!-- 	<label for="password" class="label"> Password Protection (Optional) </label> -->
			<!-- 	<input -->
			<!-- 		id="password" -->
			<!-- 		type="password" -->
			<!-- 		bind:value={password} -->
			<!-- 		placeholder="Leave empty for no password" -->
			<!-- 		class="input password" -->
			<!-- 	/> -->
			<!-- </div> -->
			<div class="flex-1 min-w-[250px]">
				<label for="password" class="label"> Password Protection (Optional) </label>
				<div class="relative">
					<input
						id="password"
						type={showPassword ? 'text' : 'password'}
						bind:value={password}
						placeholder="Leave empty for no password"
						class="input password w-full"
					/>
					<button
						type="button"
						class="absolute right-2 top-1/2 -translate-y-1/2 pt-1 pr-1"
						onclick={togglePasswordVisibility}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						<span class="text-surface-500 hover:text-surface-300">
							<Icon selected={showPassword ? 'eye-off' : 'eye'} />
						</span>
					</button>
				</div>
			</div>

			<!-- Privacy Toggle (for logged-in users) -->
			<div class="flex items-center self-end h-[42px]">
				<input
					id="private"
					type="checkbox"
					bind:checked={isPrivate}
					class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
				/>
				<label for="private" class="label flex flex-row pl-2">
					<span class="pr-2">Make paste private</span>
					<span class="badge-icon variant-filled cursor-auto" use:popup={popupClick}
						><Icon selected="private" /></span
					>
				</label>
			</div>
		</div>

		<!-- Submit Button -->
		<div class="p-2">
			<button
				type="submit"
				class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				disabled={isLoading}
			>
				{#if isLoading}
					Creating...
				{:else}
					Create Paste
				{/if}
			</button>
		</div>
	</form>
</div>

<div class="card p-4 variant-filled-primary" data-popup="popupClick">
	<p>Only visible with generated link or local storage save on the device.</p>
	<p>You will need a password or anyone with a link can access it.</p>
	<div class="arrow variant-filled-primary"></div>
</div>
