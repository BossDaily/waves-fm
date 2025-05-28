<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { goto } from "$app/navigation";
	import { getRandomHexColor } from "$lib/utils.js";

	let {
		colors: initialColors,
		className,
		track,
		randomize = false
	}: {
		colors?: [string, string, string, string, string];
		className?: string;
		track: any;
		randomize?: boolean;
	} = $props();

	const defaultColors: [string, string, string, string, string] = [
		'hsla(328, 64%, 68%, 1)',
		'hsla(328, 84%, 92%, 1)',
		'hsla(303, 73%, 68%, 1)',
		'hsla(273, 58%, 78%, 1)',
		'hsla(331, 80%, 52%, 1)'
	];
	let colors = $state<[string, string, string, string, string]>(
		initialColors || defaultColors
	);
	let backgroundColor = $state<string>('');
	let palette = $state<[number, number, number][] | null>(null);
	let refreshInterval: NodeJS.Timeout | null = null;

	const generateRandomHSLColor = () => {
		const h = Math.floor(Math.random() * 360);
		const s = Math.floor(Math.random() * 30) + 60; // 60-90%
		const l = Math.floor(Math.random() * 30) + 60; // 60-90%
		return `hsla(${h}, ${s}%, ${l}%, 1)`;
	};

	const generateRandomColors = (): [string, string, string, string, string] => {
		return Array.from({ length: 5 }, generateRandomHSLColor) as [string, string, string, string, string];
	};

	const rgbToHsla = (r: number, g: number, b: number): string => {
		// Convert RGB to [0,1] range
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0;
		let s = 0;
		const l = (max + min) / 2;

		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}

			h /= 6;
		}

		// Convert to degrees and percentages
		h = Math.round(h * 360);
		s = Math.round(s * 100);
		const l_percent = Math.round(l * 100);

		return `hsla(${h}, ${s}%, ${l_percent}%, 1)`;
	};

	// Custom color extraction function using canvas
	async function extractPalette(imageUrl: string): Promise<[number, number, number][]> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = "anonymous";
			
			img.onload = () => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				if (!ctx) {
					reject(new Error('Could not get canvas context'));
					return;
				}

				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);

				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				const data = imageData.data;
				const colorCounts: { [key: string]: number } = {};

				// Sample every 10th pixel for performance
				for (let i = 0; i < data.length; i += 40) {
					const r = data[i];
					const g = data[i + 1];
					const b = data[i + 2];
					const key = `${r},${g},${b}`;
					colorCounts[key] = (colorCounts[key] || 0) + 1;
				}

				// Get the most common colors (up to 10)
				const sortedColors = Object.entries(colorCounts)
					.sort((a, b) => b[1] - a[1])
					.slice(0, 10)
					.map(([key]) => {
						const [r, g, b] = key.split(',').map(Number);
						return [r, g, b] as [number, number, number];
					});

				resolve(sortedColors);
			};

			img.onerror = () => {
				reject(new Error('Failed to load image'));
			};

			img.src = imageUrl;
		});
	}

	// Helper to convert a palette to five colors for the gradient
	function paletteToColors(palette: [number, number, number][] | null): [string, string, string, string, string] {
		console.log('🎨 paletteToColors called with:', palette);
		
		if (!palette || palette.length === 0) {
			console.log('❌ No palette provided, generating random colors');
			const randomColors = generateRandomColors();
			console.log('🎲 Generated random colors:', randomColors);
			return randomColors;
		}

		console.log('✅ Processing palette with', palette.length, 'colors');
		
		// Filter out very dark or very light colors and get the 5 most vibrant ones
		const filteredColors = palette
			.slice(1) // Skip the first color as it's used for background
			.filter((color): color is [number, number, number] => {
				if (!color) return false;
				const [r, g, b] = color as [number, number, number];
				const brightness = (r * 299 + g * 587 + b * 114) / 1000;
				const isValid = brightness > 30 && brightness < 220;
				console.log(`🔍 Color [${r}, ${g}, ${b}] brightness: ${brightness.toFixed(1)}, valid: ${isValid}`);
				return isValid;
			})
			.slice(0, 5); // Get top 5 colors

		console.log('🎯 Filtered colors:', filteredColors);

		// Ensure we have exactly 5 colors
		const finalColors = [...filteredColors];
		while (finalColors.length < 5) {
			const fallbackColor = filteredColors[0] || [255, 100, 100];
			console.log('⚠️ Adding fallback color:', fallbackColor);
			finalColors.push(fallbackColor);
		}

		const hslaColors = finalColors.map(([r, g, b]) => {
			const hslaColor = rgbToHsla(r, g, b);
			console.log(`🌈 RGB [${r}, ${g}, ${b}] → HSLA ${hslaColor}`);
			return hslaColor;
		}) as [string, string, string, string, string];
		console.log('🎊 Final HSLA colors:', hslaColors);
		return hslaColors;
	}

	// Extract palette and update colors when track changes
	async function updateColorsFromTrack() {
		console.log('🚀 Updating colors for track:', track?.name, 'by', track?.artist?.['#text']);
		
		if (track?.image?.[3]?.['#text']) {
			console.log('🖼️ Extracting palette from image:', track.image[3]['#text']);
			try {
				const startTime = performance.now();
				const newPalette = await extractPalette(track.image[3]['#text']);
				const endTime = performance.now();
				console.log(`⏱️ Palette extraction took ${(endTime - startTime).toFixed(2)}ms`);
				console.log('🎨 Raw extracted palette:', newPalette);
				
				if (newPalette && newPalette.length > 0) {
					console.log('🎯 Using extracted palette with', newPalette.length, 'colors');
					palette = newPalette;
					
					// Get the dominant color (first color in palette) for background
					const [r, g, b] = newPalette[0] as [number, number, number];
					const bgColor = rgbToHsla(r, g, b);
					console.log(`🏠 Background color: RGB [${r}, ${g}, ${b}] → HSLA ${bgColor}`);
					backgroundColor = bgColor;
					colors = paletteToColors(newPalette);
				} else {
					console.log('❌ Palette extraction returned empty result');
					if (randomize) {
						console.log('🎲 Falling back to random colors');
						colors = generateRandomColors();
					}
				}
			} catch (error) {
				console.error('💥 Failed to extract palette:', error);
				if (randomize) {
					console.log('🎲 Falling back to random colors');
					colors = generateRandomColors();
				}
			}
		} else if (randomize) {
			console.log('🎲 No image URL, generating random colors');
			colors = generateRandomColors();
		} else {
			console.log('🎨 Using default colors');
			colors = initialColors || defaultColors;
			backgroundColor = '';
		}
	}	onMount(() => {
		// Auto refresh effect
		refreshInterval = setInterval(() => {
			goto('', { invalidateAll: true });
		}, 5000);
		
		// Initial color update
		updateColorsFromTrack();
	});
	
	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});
	// React to track changes
	$effect(() => {
		if (track) {
			console.log('🔄 Track changed, updating colors...', track.name);
			updateColorsFromTrack();
		}
	});

	// Create properly formatted gradient style
	const gradientStyle = $derived(() => {
		const backgroundImage = [
			`radial-gradient(circle at var(--x-0, 40%) var(--y-0, 20%), ${colors[0]} var(--s-start-0, 0%), transparent var(--s-end-0, 50%))`,
			`radial-gradient(circle at var(--x-1, 80%) var(--y-1, 0%), ${colors[1]} var(--s-start-1, 0%), transparent var(--s-end-1, 50%))`,
			`radial-gradient(circle at var(--x-2, 0%) var(--y-2, 50%), ${colors[2]} var(--s-start-2, 0%), transparent var(--s-end-2, 50%))`,
			`radial-gradient(circle at var(--x-3, 80%) var(--y-3, 50%), ${colors[3]} var(--s-start-3, 0%), transparent var(--s-end-3, 50%))`,
			`radial-gradient(circle at var(--x-4, 0%) var(--y-4, 100%), ${colors[4]} var(--s-start-4, 0%), transparent var(--s-end-4, 50%))`
		].join(', ');

		return {
			backgroundColor,
			backgroundImage
		};
	});	// Enhanced debug logging
	$effect(() => {
		console.group('🎨 AnimatedGradient State Update');
		console.log('🌈 Current colors:', colors);
		console.log('🏠 Background color:', backgroundColor);
		console.log('🎯 Raw palette:', palette);
		console.log('🎨 Generated gradient style:', gradientStyle());
		console.groupEnd();
	});
</script>

<div 
	class="gradient-container {className || ''}"
	style="background-color: {backgroundColor}; background-image: {gradientStyle().backgroundImage};"
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
		background-blend-mode: normal, normal, normal, normal, normal;
		animation: hero-gradient-animation 15s linear infinite alternate;
	}
	
	/* Test styles to ensure visibility */
	.gradient-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24, #f0932b);
		opacity: 0.3;
		z-index: -1;
	}
</style>
