<script lang="ts">	import { onMount, onDestroy } from "svelte";
	import { 
		getRandomHexColor, 
		rgbArrayToHex,
		extractColorsFromImage 
	} from "$lib/utils.js";

	let {
		colors: initialColors,
		className,
		track,
		randomize = false // This prop seems unused currently, but let's keep it
	}: {
		colors?: [string, string, string, string, string];
		className?: string;
		track: any;
		randomize?: boolean;
	} = $props();
	const defaultColors: [string, string, string, string, string] = [
		'#CF72AE', // rgba(207, 114, 174, 1)
		'#F4C4EA', // rgba(244, 196, 234, 1)
		'#B76BC9', // rgba(183, 107, 201, 1)
		'#A686DA', // rgba(166, 134, 218, 1)
		'#C7439D'  // rgba(199, 67, 157, 1)
	];
	let colors = $state<[string, string, string, string, string]>(
		initialColors || defaultColors
	);	let backgroundColor = $state<string>('');
	let palette = $state<[number, number, number][] | null>(null);

	// Simplified helper to convert raw ColorThief palette to HEX strings
	function paletteToColors(palette: [number, number, number][] | null): [string, string, string, string, string] {
		console.log('🎨 Converting raw palette to HEX strings:', palette);
		
		if (!palette || palette.length === 0) {
			console.log('❌ No palette provided to paletteToColors, returning empty array for colors.');
			return [] as unknown as [string, string, string, string, string]; 
		}

		const filledPalette = [...palette];
		// Ensure 5 colors by repeating the last one if necessary
		while (filledPalette.length > 0 && filledPalette.length < 5) {
			filledPalette.push(filledPalette[filledPalette.length - 1]);
		}
		
		if (filledPalette.length === 0) {
			return [] as unknown as [string, string, string, string, string];
		}
		const hexColors = filledPalette.slice(0, 5).map(([r, g, b]) => {
			return rgbArrayToHex([r, g, b]); // Use utility function
		}) as [string, string, string, string, string];

		console.log('🎉 Final raw HEX gradient colors:', hexColors);
		return hexColors;
	}

	// Extract palette and update colors when track changes
	async function updateColorsFromTrack() {
		console.log('🚀 Updating colors for track:', track?.name, 'by', track?.artist?.["#text"]);
				if (track?.image?.[3]?.['#text']) {
			console.log('🖼️ Extracting palette from image using ColorThief:', track.image[3]['#text']);
			try {
				const newPalette = await extractColorsFromImage(track.image[3]['#text']);
				console.log('🎨 ColorThief extracted palette:', newPalette);
				
				if (newPalette && newPalette.length > 0) {
					palette = newPalette;
					const [r, g, b] = newPalette[0] as [number, number, number];
					const brightness = (r + g + b) / 3;
					let bgR, bgG, bgB;
					if (brightness < 60) {
						bgR = Math.max(5, Math.round(r * 0.6));
						bgG = Math.max(5, Math.round(g * 0.6));
						bgB = Math.max(5, Math.round(b * 0.6));
					} else {
						bgR = Math.max(20, Math.round(r * 0.3));
						bgG = Math.max(20, Math.round(g * 0.3));
						bgB = Math.max(20, Math.round(b * 0.3));
					}
					backgroundColor = rgbArrayToHex([bgR, bgG, bgB]); // Use utility function
					colors = paletteToColors(newPalette);
				} else if (initialColors && initialColors.length === 5) {
					colors = initialColors; // Assuming initialColors are already HEX if provided
					backgroundColor = '';
				} else {
					colors = defaultColors;
					backgroundColor = '';
				}
			} catch (error) {
				console.error('💥 Failed to extract palette with ColorThief:', error);
				if (initialColors && initialColors.length === 5) {
					colors = initialColors;
					backgroundColor = '';
				} else {
					colors = defaultColors;
					backgroundColor = '';
				}
			}
		} else if (initialColors && initialColors.length === 5) {
			colors = initialColors;
			backgroundColor = '';
		} else {
			colors = defaultColors;
			backgroundColor = '';
		}
	}	onMount(() => {
		// Initial color update
		updateColorsFromTrack();
	});
	// React to track changes
	$effect(() => {
		if (track) {
			console.log('🔄 Track changed, updating colors...', track.name);
			updateColorsFromTrack();
		}
	});

	// Enhanced debug logging
	$effect(() => {
		console.group('🎨 AnimatedGradient State Update');
		console.log('🌈 Current colors (for CSS variables --c-0 to --c-4):', colors);
		console.log('🏠 Background color:', backgroundColor);
		console.log('🎯 Raw palette (RGB):', palette);
		console.groupEnd();
	});
</script>

<div 
	class="gradient-container {className || ''}"
	style="background-color: {backgroundColor}; --c-0: {colors[0]}; --c-1: {colors[1]}; --c-2: {colors[2]}; --c-3: {colors[3]}; --c-4: {colors[4]};"
	data-colors="{JSON.stringify(colors)}"
	data-background="{backgroundColor}"
></div>

<style>
	@import "../styles/AnimatedGradient.css";	.gradient-container {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1;
		background-image: 
			radial-gradient(circle at var(--x-0, 40%) var(--y-0, 20%), var(--c-0) var(--s-start-0, 0%), transparent var(--s-end-0, 50%)),
			radial-gradient(circle at var(--x-1, 80%) var(--y-1, 0%), var(--c-1) var(--s-start-1, 0%), transparent var(--s-end-1, 50%)),
			radial-gradient(circle at var(--x-2, 0%) var(--y-2, 50%), var(--c-2) var(--s-start-2, 0%), transparent var(--s-end-2, 50%)),
			radial-gradient(circle at var(--x-3, 80%) var(--y-3, 50%), var(--c-3) var(--s-start-3, 0%), transparent var(--s-end-3, 50%)),
			radial-gradient(circle at var(--x-4, 0%) var(--y-4, 100%), var(--c-4) var(--s-start-4, 0%), transparent var(--s-end-4, 50%));
		background-blend-mode: normal, normal, normal, normal, normal;
		animation: hero-gradient-animation 15s linear infinite alternate;
	}
</style>
