<script lang="ts">
	let isHovered = $state(false);

	function onMouseEnter() {
		isHovered = true;
	}

	function onMouseLeave() {
		isHovered = false;
	}
</script>

<div class="button-container">
	<!-- Multiple glow layers for supernova effect -->
	<div
		class="glow-layer layer-outer"
		class:hovered={isHovered}
		style:filter="blur(30px)"
		style:transform={`scale(${isHovered ? 1.5 : 1})`}
		style:opacity={isHovered ? 1 : 0.5}
	/>
	<div
		class="glow-layer layer-middle"
		class:hovered={isHovered}
		style:filter="blur(20px)"
		style:transform={`scale(${isHovered ? 1.25 : 1})`}
		style:opacity={isHovered ? 0.8 : 0.4}
	/>
	<div
		class="glow-layer layer-inner"
		class:hovered={isHovered}
		style:filter="blur(15px)"
		style:transform={`scale(${isHovered ? 1.1 : 1})`}
		style:opacity={isHovered ? 0.9 : 0.3}
	/>

	<!-- Main Button -->
	<button
		class="paste-button"
		class:hovered={isHovered}
		onmouseenter={onMouseEnter}
		onmouseleave={onMouseLeave}
	>
		<span class="button-text">Paste</span>

		<!-- Shine effect -->
		<div class="shine-container">
			<div class="shine-effect" class:hovered={isHovered} />
		</div>
	</button>
</div>

<style>
	.button-container {
		position: relative;
		display: inline-block;
	}

	.glow-layer {
		position: absolute;
		inset: 0;
		transition: all 700ms ease;
	}

	.layer-outer {
		background: radial-gradient(
			circle at center,
			rgba(34, 211, 167, 0.8) 0%,
			rgba(108, 93, 211, 0.6) 40%,
			rgba(255, 87, 87, 0.4) 60%,
			transparent 70%
		);
	}

	.layer-middle {
		background: radial-gradient(
			circle at center,
			rgba(34, 211, 167, 0.9) 0%,
			rgba(108, 93, 211, 0.7) 30%,
			rgba(255, 87, 87, 0.5) 50%,
			transparent 60%
		);
		transition: all 500ms ease;
	}

	.layer-inner {
		background: radial-gradient(
			circle at center,
			rgba(34, 211, 167, 1) 0%,
			rgba(108, 93, 211, 0.8) 20%,
			rgba(255, 87, 87, 0.6) 40%,
			transparent 50%
		);
		transition: all 300ms ease;
	}

	.paste-button {
		position: relative;
		padding: 1.75rem 7rem;
		font-size: 1.5rem;
		font-weight: 700;
		border-radius: 9999px;
		background: #22d3a7;
		border: none;
		cursor: pointer;
		transition: all 300ms ease;
		transform: scale(1);
	}

	.paste-button.hovered {
		transform: scale(1.05);
	}

	.button-text {
		position: relative;
		z-index: 10;
		color: #1e1e31;
	}

	.shine-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border-radius: 9999px;
	}

	.shine-effect {
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transform: translateX(-100%);
		transition: transform 1000ms ease;
	}

	.shine-effect.hovered {
		transform: translateX(100%);
	}
</style>
