<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	// Import your preferred icon component
	// If using Skeleton UI's newer versions with Icon component:
	// import { Icon } from '@skeletonlabs/skeleton';
</script>

<div class="container mx-auto p-4">
	<!-- Navbar with settings button -->
	<header class="flex justify-end p-4">
		<!-- Replace with your preferred icon component -->
		<span class="text-xl"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 24 24"
				{...$$props}
				><path
					fill="currentColor"
					d="M10.825 22q-.675 0-1.162-.45t-.588-1.1L8.85 18.8q-.325-.125-.612-.3t-.563-.375l-1.55.65q-.625.275-1.25.05t-.975-.8l-1.175-2.05q-.35-.575-.2-1.225t.675-1.075l1.325-1Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337l-1.325-1Q2.675 9.9 2.525 9.25t.2-1.225L3.9 5.975q.35-.575.975-.8t1.25.05l1.55.65q.275-.2.575-.375t.6-.3l.225-1.65q.1-.65.588-1.1T10.825 2h2.35q.675 0 1.163.45t.587 1.1l.225 1.65q.325.125.613.3t.562.375l1.55-.65q.625-.275 1.25-.05t.975.8l1.175 2.05q.35.575.2 1.225t-.675 1.075l-1.325 1q.025.175.025.338v.674q0 .163-.05.338l1.325 1q.525.425.675 1.075t-.2 1.225l-1.2 2.05q-.35.575-.975.8t-1.25-.05l-1.5-.65q-.275.2-.575.375t-.6.3l-.225 1.65q-.1.65-.587 1.1t-1.163.45zM11 20h1.975l.35-2.65q.775-.2 1.438-.587t1.212-.938l2.475 1.025l.975-1.7l-2.15-1.625q.125-.35.175-.737T17.5 12t-.05-.787t-.175-.738l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.212-.962t-1.438-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.55.575 1.213.963t1.437.587zm1.05-4.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.487 1.025T8.55 12t1.013 2.475T12.05 15.5M12 12"
				/></svg
			></span
		>
		<span class="sr-only">Settings</span>
	</header>

	<!-- Hero section with CTA -->
	<div class="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-10">
		<div class="space-y-4">
			<h1 class="h1 text-primary-500">Share Code Instantly</h1>
			<p class="text-xl max-w-md mx-auto">
				A simple and secure way to share code snippets and text with anyone.
			</p>
		</div>

		<!-- CTA Card -->
		<div class="card p-10 variant-glass-surface w-full max-w-2xl">
			<a href="/new" class="btn btn-xl variant-filled-primary w-full py-8 text-3xl font-bold">
				Paste
			</a>
			<p class="pt-4 text-surface-400">No account required. Just paste and share.</p>
		</div>

		<!-- Feature highlights -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
			<div class="card p-4 variant-ghost-surface text-center">
				<h3 class="h3 text-secondary-500">Simple</h3>
				<p>No signup needed</p>
			</div>
			<div class="card p-4 variant-ghost-surface text-center">
				<h3 class="h3 text-secondary-500">Secure</h3>
				<p>Private by default</p>
			</div>
			<div class="card p-4 variant-ghost-surface text-center">
				<h3 class="h3 text-secondary-500">Swift</h3>
				<p>Instant sharing</p>
			</div>
		</div>
	</div>
</div>
