<script lang="ts">
	import AnimatedGradient from "$lib/components/AnimatedGradient.svelte";
	import type { PageData } from "./$types.js";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta property="og:title" content="Generated animated waves from the song: {data.track.name}" />
	<meta property="og:description" content="By {data.track.artist['#text']} on the album {data.track.album['#text']}" />	<meta property="og:image" content={data.meta.image} />
	<link rel="icon" href={data.meta.favicon} />
</svelte:head>

<main class="min-h-screen relative">
	<AnimatedGradient track={data.track} randomize={false} />
	<!-- Debug info to ensure the page is loading -->
	<div class="absolute top-4 left-4 z-50 text-white bg-black bg-opacity-50 p-2 rounded">
		Track: {data.track.name} by {data.track.artist['#text']}
	</div>
</main>
