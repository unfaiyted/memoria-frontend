<script>
	// Props
	/** @type {Array<{name: string, svg: string}>} - Array of SVG objects with names */
	const icons = [
		{
			name: 'heart',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
		},
		{
			name: 'star',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'
		},
		{
			name: 'code',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
			fill="currentColor"
			d="M7 19q-.825 0-1.412-.587T5 17q0-.375.15-.737t.45-.663l10-10q.3-.3.663-.45T17 5q.825 0 1.413.587T19 7q0 .375-.137.75t-.438.675l-10 10q-.3.3-.663.438T7 19"/></svg>`
		},
		{
			name: 'text',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" ><!-- Icon from All by undefined - undefined --><path fill="currentColor" d="M1 19.025v-5h2v3h18v-3h2v5zM9.55 15v-.85h-.075q-.325.5-.875.788t-1.25.287q-1.225 0-1.925-.637t-.7-1.738q0-1.05.813-1.712t2.087-.663q.575 0 1.063.088t.837.287v-.35q0-.675-.462-1.075t-1.263-.4q-.525 0-.987.225t-.788.65L4.95 9.1q.475-.675 1.2-1.025t1.675-.35q1.55 0 2.375.738t.825 2.137V15zM7.9 11.65q-.8 0-1.225.313t-.425.887q0 .5.375.813t.975.312q.8 0 1.363-.562t.562-1.363q-.35-.2-.8-.3t-.825-.1M12.525 15V4.975h1.55V7.8L14 8.8h.075q.075-.125.6-.638t1.65-.512q1.6 0 2.525 1.15t.925 2.65t-.912 2.638t-2.538 1.137q-1.025 0-1.562-.45t-.688-.7H14V15zM16.1 9.05q-1 0-1.55.738T14 11.425q0 .925.55 1.65t1.55.725t1.563-.725t.562-1.65t-.562-1.65T16.1 9.05"/></svg>`
		},

		{
			name: 'clear',
			svg: `<svg
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										viewBox="0 0 24 24"
										><!-- Icon from All by undefined - undefined --><path
											fill="currentColor"
											d="M7 19q-.825 0-1.412-.587T5 17q0-.375.15-.737t.45-.663l10-10q.3-.3.663-.45T17 5q.825 0 1.413.587T19 7q0 .375-.137.75t-.438.675l-10 10q-.3.3-.663.438T7 19"
										/></svg
									>`
		},
		{
			name: 'private',
			svg: `<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							viewBox="0 0 24 24"
							><!-- Icon from All by undefined - undefined --><path
								fill="currentColor"
								d="M10.6 16q0-2.025.363-2.912T12.5 11.15q1.025-.9 1.563-1.562t.537-1.513q0-1.025-.687-1.7T12 5.7q-1.275 0-1.937.775T9.125 8.05L6.55 6.95q.525-1.6 1.925-2.775T12 3q2.625 0 4.038 1.463t1.412 3.512q0 1.25-.537 2.138t-1.688 2.012Q14 13.3 13.738 13.913T13.475 16zm1.4 6q-.825 0-1.412-.587T10 20t.588-1.412T12 18t1.413.588T14 20t-.587 1.413T12 22"
							/></svg>
`
		},
		{
			name: 'bullet-list',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="M9 19v-2h12v2zm0-6v-2h12v2zm0-6V5h12v2zM5 20q-.825 0-1.412-.587T3 18t.588-1.412T5 16t1.413.588T7 18t-.587 1.413T5 20m0-6q-.825 0-1.412-.587T3 12t.588-1.412T5 10t1.413.588T7 12t-.587 1.413T5 14m0-6q-.825 0-1.412-.587T3 6t.588-1.412T5 4t1.413.588T7 6t-.587 1.413T5 8"
				/></svg>`
		},
		{
			name: 'bold',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="M6.8 19V5h5.525q1.625 0 3 1T16.7 8.775q0 1.275-.575 1.963t-1.075.987q.625.275 1.388 1.025T17.2 15q0 2.225-1.625 3.113t-3.05.887zm3.025-2.8h2.6q1.2 0 1.463-.612t.262-.888t-.262-.887t-1.538-.613H9.825zm0-5.7h2.325q.825 0 1.2-.425t.375-.95q0-.6-.425-.975t-1.1-.375H9.825z"
				/></svg
			>`
		},
		{
			name: 'italics',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
				><path fill="currentColor" d="M5 19v-2.5h4l3-9H8V5h10v2.5h-3.5l-3 9H15V19z" /></svg>`
		},
		{
			name: 'strike-through',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
				><path fill="currentColor" d="M2 14v-2h20v2zm8.5-4V7H5V4h14v3h-5.5v3zm0 10v-4h3v4z" /></svg>`
		},
		{
			name: 'codeblock',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="m8 18l-6-6l6-6l1.425 1.425l-4.6 4.6L9.4 16.6zm8 0l-1.425-1.425l4.6-4.6L14.6 7.4L16 6l6 6z"
				/></svg>`
		},
		{
			name: 'paste',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="m18 21l-1.4-1.425L18.175 18H12v-2h6.175L16.6 14.4L18 13l4 4zm3-10h-2V5h-2v3H7V5H5v14h5v2H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.175q.275-.875 1.075-1.437T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5zm-9-6q.425 0 .713-.288T13 4t-.288-.712T12 3t-.712.288T11 4t.288.713T12 5"
				/></svg>`
		},
		{
			name: 'h1',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
				><path fill="currentColor" d="M5 17V7h2v4h4V7h2v10h-2v-4H7v4zm12 0V9h-2V7h4v10z" /></svg>`
		},
		{
			name: 'h2',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="M3 17V7h2v4h4V7h2v10H9v-4H5v4zm10 0v-4q0-.825.588-1.412T15 11h4V9h-6V7h6q.825 0 1.413.588T21 9v2q0 .825-.587 1.413T19 13h-4v2h6v2z"
				/></svg>`
		},
		{
			name: 'cog',
			svg: `<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 24 24"
				><path
					fill="currentColor"
					d="M10.825 22q-.675 0-1.162-.45t-.588-1.1L8.85 18.8q-.325-.125-.612-.3t-.563-.375l-1.55.65q-.625.275-1.25.05t-.975-.8l-1.175-2.05q-.35-.575-.2-1.225t.675-1.075l1.325-1Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337l-1.325-1Q2.675 9.9 2.525 9.25t.2-1.225L3.9 5.975q.35-.575.975-.8t1.25.05l1.55.65q.275-.2.575-.375t.6-.3l.225-1.65q.1-.65.588-1.1T10.825 2h2.35q.675 0 1.163.45t.587 1.1l.225 1.65q.325.125.613.3t.562.375l1.55-.65q.625-.275 1.25-.05t.975.8l1.175 2.05q.35.575.2 1.225t-.675 1.075l-1.325 1q.025.175.025.338v.674q0 .163-.05.338l1.325 1q.525.425.675 1.075t-.2 1.225l-1.2 2.05q-.35.575-.975.8t-1.25-.05l-1.5-.65q-.275.2-.575.375t-.6.3l-.225 1.65q-.1.65-.587 1.1t-1.163.45zM11 20h1.975l.35-2.65q.775-.2 1.438-.587t1.212-.938l2.475 1.025l.975-1.7l-2.15-1.625q.125-.35.175-.737T17.5 12t-.05-.787t-.175-.738l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.212-.962t-1.438-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.55.575 1.213.963t1.437.587zm1.05-4.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.487 1.025T8.55 12t1.013 2.475T12.05 15.5M12 12"
				/></svg>`
		},
		{
			name: 'eye',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><!-- Icon from Remix Icon by Remix Design - https://github.com/Remix-Design/RemixIcon/blob/master/License --><path fill="currentColor" d="M12 3c5.392 0 9.878 3.88 10.819 9c-.94 5.12-5.427 9-10.819 9s-9.878-3.88-10.818-9C2.122 6.88 6.608 3 12 3m0 16a9.005 9.005 0 0 0 8.778-7a9.005 9.005 0 0 0-17.555 0A9.005 9.005 0 0 0 12 19m0-2.5a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9m0-2a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5"/></svg>`
		},
		{
			name: 'eye-off',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><!-- Icon from Remix Icon by Remix Design - https://github.com/Remix-Design/RemixIcon/blob/master/License --><path fill="currentColor" d="M17.883 19.297A10.95 10.95 0 0 1 12 21c-5.392 0-9.878-3.88-10.818-9A11 11 0 0 1 4.52 5.935L1.394 2.808l1.414-1.414l19.799 19.798l-1.414 1.415zM5.936 7.35A8.97 8.97 0 0 0 3.223 12a9.005 9.005 0 0 0 13.201 5.838l-2.028-2.028A4.5 4.5 0 0 1 8.19 9.604zm6.978 6.978l-3.242-3.241a2.5 2.5 0 0 0 3.241 3.241m7.893 2.265l-1.431-1.431A8.9 8.9 0 0 0 20.778 12A9.005 9.005 0 0 0 9.552 5.338L7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.95 10.95 0 0 1-2.012 4.593m-9.084-9.084Q11.86 7.5 12 7.5a4.5 4.5 0 0 1 4.492 4.778z"/></svg>`
		},
		{
			name: 'note',
			svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" ><!-- Icon from All by undefined - undefined --><path fill="currentColor" d="M4 14v-2h7v2zm0-4V8h11v2zm0-4V4h11v2zm9 14v-3.075l5.525-5.5q.225-.225.5-.325t.55-.1q.3 0 .575.113t.5.337l.925.925q.2.225.313.5t.112.55t-.1.563t-.325.512l-5.5 5.5zm6.575-5.6l.925-.975l-.925-.925l-.95.95z"/></svg>`
		},

		// TODO: apply to main
		// class={`lucide w-8 h-8 mr-2 text-purple-50`}
		{
			name: '',
			svg: `<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"
						></path></svg>`
		},
		{ name: '', svg: `` },
		{ name: '', svg: `` },
		{ name: '', svg: `` }
	];

	/** @type {string} - Name of the selected icon */

	export let selected = '';

	/** @type {string} - Width of the SVG */
	export let width = '24px';

	/** @type {string} - Height of the SVG */
	export let height = '24px';

	/** @type {string} - Fill color of the SVG */
	export let fill = 'currentColor';

	// Find the selected SVG
	$: selectedSvg = icons.find((icon) => icon.name === selected)?.svg || '';
</script>

{#if selectedSvg}
	<div class="svg-container" style="width: {width}; height: {height};" {...$$restProps}>
		{@html selectedSvg.replace(/fill="[^"]*"/g, `fill="${fill}"`)}
	</div>
{:else}
	<div class="svg-not-found" {...$$restProps}>
		Icon "{selected}" not found
	</div>
{/if}

<style>
	.svg-container {
		display: inline-block;
	}

	.svg-not-found {
		color: #ff0000;
		font-size: 12px;
	}

	/* Make sure SVG fills the container */
	:global(.svg-container svg) {
		width: 100%;
		height: 100%;
	}
</style>
