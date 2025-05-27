<script lang="ts">
	import CanvasGradient from "$lib/components/CanvasGradient.svelte";
	import type { PageData } from "./$types.js";

	let { data }: { data: PageData } = $props();
</script>

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
</main>
