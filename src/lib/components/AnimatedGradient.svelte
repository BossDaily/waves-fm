<script lang="ts">	import { onMount, onDestroy } from "svelte";
	import { getRandomHexColor } from "$lib/utils.js";
	import ColorThief from "colorthief";

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
	);
	let backgroundColor = $state<string>('');
	let palette = $state<[number, number, number][] | null>(null);

	// Helper function to convert RGB to HEX
	const rgbToHex = (r: number, g: number, b: number): string => {
		return `#${[r, g, b].map(x => {
			const hex = x.toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		}).join('')}`;
	};

	// Replaced with logic from ColorDebug.svelte's extractColorsFromImage
	async function extractPalette(imageUrl: string): Promise<[number, number, number][]> {
		try {
			console.log('🎨 Extracting palette using ColorDebug logic from:', imageUrl);
			const startTime = performance.now();
			
			const img = new Image();
			img.crossOrigin = 'Anonymous'; 
			
			const colorThief = new ColorThief();
			
			return new Promise((resolve, reject) => {
				img.onload = () => {
					try {
						const endTime = performance.now();
						console.log(`⏱️ Image loaded in ${(endTime - startTime).toFixed(2)}ms (AnimatedGradient)`);
						
						// Get the dominant color first
						const dominantColor = colorThief.getColor(img, 10);
						console.log('🎨 Dominant color (AnimatedGradient):', dominantColor);
						
						// Get palette of 5 colors with good quality
						const palette = colorThief.getPalette(img, 5, 10);
						console.log('🎨 ColorThief palette (AnimatedGradient):', palette);
						
						if (palette && palette.length > 0) {
							// Ensure we have the dominant color first, then the palette
							const colorsToProcess: [number, number, number][] = [dominantColor as [number, number, number]];
							
							// Add palette colors that aren't too similar to dominant
							for (const color of palette) {
								const [r, g, b] = color;
								const distance = Math.sqrt(
									Math.pow(r - dominantColor[0], 2) +
									Math.pow(g - dominantColor[1], 2) +
									Math.pow(b - dominantColor[2], 2)
								);
								
								// Only add if sufficiently different (distance > 30)
								if (distance > 30 && colorsToProcess.length < 5) {
									colorsToProcess.push([r, g, b] as [number, number, number]);
								}
							}
							
							// Fill remaining slots with variations if needed
							while (colorsToProcess.length < 5 && colorsToProcess.length > 0) { // ensure colorsToProcess is not empty
								const baseColor = colorsToProcess[0]; // Use dominant color for variations
								const variation: [number, number, number] = [
									Math.min(255, Math.max(0, Math.round(baseColor[0] + (Math.random() - 0.5) * 50))),
									Math.min(255, Math.max(0, Math.round(baseColor[1] + (Math.random() - 0.5) * 50))),
									Math.min(255, Math.max(0, Math.round(baseColor[2] + (Math.random() - 0.5) * 50)))
								];
								// Ensure variant is not too similar to existing colors before pushing
								const isDuplicateVariant = colorsToProcess.some(existing => {
									const dist = Math.sqrt(
										Math.pow(variation[0] - existing[0], 2) +
										Math.pow(variation[1] - existing[1], 2) +
										Math.pow(variation[2] - existing[2], 2)
									);
									return dist < 30; // Use a threshold for variants too
								});
								if (!isDuplicateVariant) {
									colorsToProcess.push(variation);
								} else {
									// If variant is duplicate, break to avoid infinite loop if all possible variations are too similar
									// or try a different variation strategy if complex logic is desired.
									// For now, just log and break if we can't easily find a distinct variant.
									console.log("Could not generate a distinct variant, using current set.");
									break;
								}
							}						
							resolve(colorsToProcess.slice(0, 5));
						} else if (dominantColor) {
							// Fallback to just dominant color if palette is empty, and generate variations
							const colorsToProcess: [number, number, number][] = [dominantColor as [number, number, number]];
							while (colorsToProcess.length < 5) {
								const baseColor = colorsToProcess[0];
								const variation: [number, number, number] = [
									Math.min(255, Math.max(0, Math.round(baseColor[0] + (Math.random() - 0.5) * 50))),
									Math.min(255, Math.max(0, Math.round(baseColor[1] + (Math.random() - 0.5) * 50))),
									Math.min(255, Math.max(0, Math.round(baseColor[2] + (Math.random() - 0.5) * 50)))
								];
								const isDuplicateVariant = colorsToProcess.some(existing => {
									const dist = Math.sqrt(
										Math.pow(variation[0] - existing[0], 2) +
										Math.pow(variation[1] - existing[1], 2) +
										Math.pow(variation[2] - existing[2], 2)
									);
									return dist < 30;
								});
								if (!isDuplicateVariant) {
									colorsToProcess.push(variation);
								} else {
									console.log("Could not generate a distinct variant for dominant-only, using current set.");
									break; 
								}
							}
							resolve(colorsToProcess.slice(0,5));
						} else {
							console.log('❌ No dominant color or palette extracted by ColorThief (AnimatedGradient).');
							resolve([]); 
							return;
						}
					} catch (error) {
						console.error('💥 ColorThief processing failed (AnimatedGradient):', error);
						reject(error);
					}
				};
				
				img.onerror = (error) => {
					console.error('💥 Image loading failed (AnimatedGradient):', error);
					reject(error);
				};
				
				img.src = imageUrl;
			});
			
		} catch (error) {
			console.error('💥 ColorThief extraction failed (AnimatedGradient):', error);
			return [];
		}
	}
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
			return rgbToHex(r, g, b); // Use rgbToHex
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
				const newPalette = await extractPalette(track.image[3]['#text']);
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
					backgroundColor = rgbToHex(bgR, bgG, bgB); // Use rgbToHex
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
