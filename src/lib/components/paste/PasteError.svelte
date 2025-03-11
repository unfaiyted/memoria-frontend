<script lang="ts">
	import type { ErrorResponse } from '$lib/api/errors';

	interface PasteErrorProps {
		error: ErrorResponse;
		passwordInput: string;
		handlePasswordSubmit: (password: string) => void;
		onRetry: (id: string | number) => void;
		id: string | number;
	}

	let { error, passwordInput, handlePasswordSubmit, onRetry, id }: PasteErrorProps = $props();
</script>

{#if error.message === 'Error verifying password'}
	<div class="card variant-soft-warning p-6">
		<div class="flex justify-center w-full">
			<div class="flex flex-col items-center max-w-md w-full">
				<div class="flex gap-2 items-center mb-2">
					<span class="md:text-3xl">⚠️</span>
					<h3 class="h3 font-bold">Password Required</h3>
				</div>

				<div
					class="input-group input-group-divider md:grid-cols-[auto_1fr_auto] w-full mt-2 rounded-xl sm:rounded-3xl"
				>
					<div
						class="input-group-shim flex flex-row sm:text-center h-[30px] md:h-[auto] sm:justify-center"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
							><!-- Icon from All by undefined - undefined --><path
								fill="currentColor"
								fill-rule="evenodd"
								d="M3.172 5.172C2 6.343 2 8.229 2 12s0 5.657 1.172 6.828S6.229 20 10 20h4c3.771 0 5.657 0 6.828-1.172S22 15.771 22 12s0-5.657-1.172-6.828S17.771 4 14 4h-4C6.229 4 4.343 4 3.172 5.172M12.75 10a.75.75 0 0 0-1.5 0v.701l-.607-.35a.75.75 0 0 0-.75 1.298l.607.35l-.607.351a.75.75 0 1 0 .75 1.3l.607-.351V14a.75.75 0 0 0 1.5 0v-.7l.607.35a.75.75 0 0 0 .75-1.3L13.5 12l.607-.35a.75.75 0 0 0-.75-1.3l-.607.35zm-6.017-.75a.75.75 0 0 1 .75.75v.7l.606-.35a.75.75 0 0 1 .75 1.3l-.607.35l.607.35a.75.75 0 1 1-.75 1.3l-.606-.35v.7a.75.75 0 0 1-1.5 0v-.701l-.608.35a.75.75 0 0 1-.75-1.298L5.232 12l-.607-.35a.75.75 0 1 1 .75-1.3l.608.351V10a.75.75 0 0 1 .75-.75m11.285.75a.75.75 0 0 0-1.5 0v.701l-.607-.35a.75.75 0 0 0-.75 1.298l.607.35l-.608.351a.75.75 0 0 0 .75 1.3l.608-.351V14a.75.75 0 0 0 1.5 0v-.7l.607.35a.75.75 0 0 0 .75-1.3l-.607-.35l.607-.35a.75.75 0 0 0-.75-1.3l-.607.35z"
								clip-rule="evenodd"
							/></svg
						>
					</div>
					<input
						type="password"
						placeholder="Enter password..."
						bind:value={passwordInput}
						onkeypress={(e) => {
							if (e.key === 'Enter') {
								handlePasswordSubmit(passwordInput);
								passwordInput = '';
							}
						}}
					/>
					<button
						class="variant-filled-secondary text-center h-[32px] md:h-[auto]"
						onclick={() => {
							handlePasswordSubmit(passwordInput);
							passwordInput = '';
						}}>Submit</button
					>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="card variant-filled-error p-6">
		<div class="flex gap-4 items-start">
			<span class="text-3xl">⚠️</span>
			<div>
				<h3 class="h3 font-bold">Error Loading Paste</h3>
				<p>{error.message}</p>
				<button class="btn variant-soft mt-4" onclick={() => onRetry(id || '')}>Try Again</button>
			</div>
		</div>
	</div>
{/if}
