<script lang="ts">
	import CanvasGradient from "$lib/components/CanvasGradient.svelte";
	import ColorDebug from "$lib/components/ColorDebug.svelte";
	import type { PageData } from "./$types.js";

	let { data }: { data: PageData } = $props();
	let showColorDebug = $state(false);

	function handleKeydown(event: KeyboardEvent) {
		if (event.key.toLowerCase() === 'd') {
			showColorDebug = !showColorDebug;
			console.log('🎨 Color debug toggled:', showColorDebug);
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta property="og:title" content="Generated animated waves from the song: {data.track.name}" />
	<meta property="og:description" content="By {data.track.artist['#text']} on the album {data.track.album['#text']}" />
	<meta property="og:image" content={data.meta.image} />
	<link rel="icon" href={data.meta.favicon} />
	<meta name="theme-color" content={data.themeColor} />
</svelte:head>

<main class="min-h-screen relative">
	<CanvasGradient track={data.track} />
	
	<!-- Color Debug Component -->
	{#if showColorDebug}
		<div class="absolute top-4 right-4 z-50 max-w-md">
			<ColorDebug track={data.track} />
		</div>
	{/if}
</main>
