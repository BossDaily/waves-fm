<script lang="ts">
	import AnimatedGradient from "$lib/components/AnimatedGradient.svelte";
	import type { PageData } from "./$types.js";
	import { onMount } from "svelte";

	let { data }: { data: PageData } = $props();
	let currentTrack = $state(data.track);

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

	onMount(() => {
		// Poll for track updates every 10 seconds
		const interval = setInterval(fetchCurrentTrack, 10000);
		
		// Cleanup interval on component destroy
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{currentTrack.name} - {currentTrack.artist['#text']}</title>
	<meta name="description" content="Currently playing: {currentTrack.name} by {currentTrack.artist['#text']} from the album {currentTrack.album['#text']}" />
	<meta property="og:title" content="Generated animated waves from the song: {currentTrack.name}" />
	<meta property="og:description" content="By {currentTrack.artist['#text']} on the album {currentTrack.album['#text']}" />
	<meta property="og:image" content={currentTrack.image[3]['#text']} />
	<link rel="icon" href={currentTrack.image[1]['#text']} />
</svelte:head>

<main class="min-h-screen relative">
	<AnimatedGradient track={currentTrack} randomize={false} />
	<!-- Debug info to ensure the page is loading -->
	<div class="absolute top-4 left-4 z-50 text-white bg-black bg-opacity-50 p-2 rounded">
		Track: {currentTrack.name} by {currentTrack.artist['#text']}
	</div>
</main>
