<script lang="ts">
	import { 
		extractColorsFromImage,
		rgbArrayToHex,
		getTextColor 
	} from "$lib/utils.js";
	import { onMount } from "svelte";

	let {
		track
	}: {
		track: any;
	} = $props();
	let extractedColors = $state<[number, number, number][]>([]);
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	// Update colors when track changes
	async function updateColors() {
		if (!track?.image?.[3]?.['#text']) {
			extractedColors = [];
			return;
		}

		isLoading = true;
		error = null;
		
		try {
			console.log('🖼️ Extracting colors from:', track.image[3]['#text']);
			const colors = await extractColorsFromImage(track.image[3]['#text']);
			extractedColors = colors;
			console.log('✅ Extracted colors:', colors);
		} catch (err) {
			console.error('💥 Color extraction failed:', err);
			error = 'Failed to extract colors from album artwork';
			extractedColors = [];
		} finally {
			isLoading = false;
		}
	}

	// React to track changes
	$effect(() => {
		if (track) {
			updateColors();
		}
	});

	onMount(() => {
		updateColors();
	});
</script>

<div class="color-debug p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
	<h2 class="text-2xl font-bold mb-4 text-gray-800">Color Extraction Debug</h2>
	
	<!-- Track Info -->
	<div class="mb-6">
		<h3 class="text-lg font-semibold text-gray-700 mb-2">Current Track</h3>
		<p class="text-gray-600">
			<strong>{track?.name || 'No track'}</strong> 
			{#if track?.artist?.['#text']}
				by {track.artist['#text']}
			{/if}
		</p>
		{#if track?.album?.['#text']}
			<p class="text-gray-500 text-sm">Album: {track.album['#text']}</p>
		{/if}
	</div>

	<!-- Album Cover and Colors -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Album Cover -->
		<div class="space-y-2">
			<h4 class="font-medium text-gray-700">Album Artwork</h4>
			{#if track?.image?.[3]?.['#text']}
				<div class="relative">
					<img 
						src={track.image[3]['#text']} 
						alt="Album cover for {track?.name}"
						class="w-full max-w-xs rounded-lg shadow-md"
						crossorigin="anonymous"
					/>
					{#if isLoading}
						<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
							<div class="text-white text-sm">Extracting colors...</div>
						</div>
					{/if}
				</div>
			{:else}
				<div class="w-full max-w-xs h-48 bg-gray-200 rounded-lg flex items-center justify-center">
					<span class="text-gray-500">No album artwork</span>
				</div>
			{/if}
		</div>

		<!-- Extracted Colors -->
		<div class="space-y-2">
			<h4 class="font-medium text-gray-700">Extracted Colors</h4>
			
			{#if error}
				<div class="text-red-600 text-sm bg-red-50 p-3 rounded">
					{error}
				</div>
			{:else if isLoading}
				<div class="text-gray-500 text-sm">Extracting colors...</div>
			{:else if extractedColors.length > 0}
				<div class="space-y-3">
					{#each extractedColors as color, index}
						<div class="flex items-center space-x-3">
							<!-- Color swatch -->							<div 
								class="w-16 h-16 rounded-lg shadow-md border border-gray-200 flex items-center justify-center text-xs font-mono"
								style="background-color: {rgbArrayToHex(color)}; color: {getTextColor(color)}"
							>
								{index === 0 ? 'DOM' : index}
							</div>
							
							<!-- Color info -->							<div class="flex-1">
								<div class="font-mono text-sm">
									{rgbArrayToHex(color)}
								</div>
								<div class="text-xs text-gray-500">
									RGB({color[0]}, {color[1]}, {color[2]})
								</div>
								{#if index === 0}
									<div class="text-xs text-blue-600 font-medium">Dominant Color</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-gray-500 text-sm">No colors extracted yet</div>
			{/if}
		</div>
	</div>

	<!-- Raw Data for Debugging -->
	{#if extractedColors.length > 0}
		<div class="mt-6 pt-4 border-t border-gray-200">
			<h4 class="font-medium text-gray-700 mb-2">Raw Color Data</h4>
			<pre class="text-xs bg-gray-100 p-3 rounded overflow-x-auto">{JSON.stringify(extractedColors, null, 2)}</pre>
		</div>
	{/if}
</div>

<style>
	.color-debug {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}
</style>
