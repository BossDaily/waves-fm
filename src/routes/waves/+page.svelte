<script lang="ts">
	import CanvasGradient from "$lib/components/CanvasGradient.svelte";
	import ColorDebug from "$lib/components/ColorDebug.svelte";
	import type { PageData } from "./$types.js";
	import { onMount } from "svelte";

	let { data }: { data: PageData } = $props();
	let currentTrack = $state(data.track);
	let showColorDebug = $state(false);

	async function fetchCurrentTrack() {
		try {
			const response = await fetch(`/api/current-track?username=${data.username}&apiKey=${data.apiKey}`);
			
			if (response.ok) {
				const newTrackData = await response.json();
				// Only update if the track has actually changed
				if (newTrackData.track && 
					(newTrackData.track.name !== currentTrack.name || 
					newTrackData.track.artist['#text'] !== currentTrack.artist['#text'])) {
					console.log('🎵 Track changed:', newTrackData.track.name, 'by', newTrackData.track.artist['#text']);
					currentTrack = newTrackData.track;
				}
			} else {
				console.error("Failed to fetch current track:", response.status);
			}
		} catch (error) {
			console.error("Error fetching current track:", error);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key.toLowerCase() === 'd') {
			showColorDebug = !showColorDebug;
			console.log('🎨 Color debug toggled:', showColorDebug);
		}
	}

	onMount(() => {
		// Poll for track updates every 10 seconds
		const interval = setInterval(fetchCurrentTrack, 10000);
		
		// Cleanup interval on component destroy
		return () => clearInterval(interval);
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
	<title>{currentTrack.name} - {currentTrack.artist['#text']}</title>
	<meta name="description" content="Currently playing: {currentTrack.name} by {currentTrack.artist['#text']} from the album {currentTrack.album['#text']}" />
	<meta property="og:title" content="Generated animated waves from the song: {currentTrack.name}" />
	<meta property="og:description" content="By {currentTrack.artist['#text']} on the album {currentTrack.album['#text']}" />
	<meta property="og:image" content={currentTrack.image[3]['#text']} />
	<link rel="icon" href={currentTrack.image[1]['#text']} />
</svelte:head>

<main class="min-h-screen relative">
	<CanvasGradient track={currentTrack} />
	
	<!-- Color Debug Component -->
	{#if showColorDebug}
		<div class="absolute top-4 right-4 z-50 max-w-md">
			<ColorDebug track={currentTrack} />
		</div>
	{/if}
</main>
