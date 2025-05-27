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
	let palette: [number, number, number][] | null = null;
	let refreshInterval: number;

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

	onMount(async () => {
		// Extract color palette from album artwork
		if (track?.image[3]['#text']) {
			try {
				palette = await extractPalette(track.image[3]['#text']);
				
				if (palette && palette.length > 0) {
					// Get the dominant color (first color in palette) for background
					const [r, g, b] = palette[0] as [number, number, number];
					const bgColor = rgbToHsla(r, g, b);
					backgroundColor = bgColor;

					// Filter out very dark or very light colors and get the 5 most vibrant ones
					const filteredColors = palette
						.slice(1) // Skip the first color as it's used for background
						.filter((color): color is [number, number, number] => {
							if (!color) return false;
							const [r, g, b] = color as [number, number, number];
							const brightness = (r * 299 + g * 587 + b * 114) / 1000;
							return brightness > 30 && brightness < 220; // Exclude too dark or too light colors
						})
						.slice(0, 5); // Get top 5 colors

					// Ensure we have exactly 5 colors
					const finalColors = [...filteredColors];
					while (finalColors.length < 5) {
						finalColors.push(filteredColors[0] || [255, 100, 100]); // Fallback color if needed
					}

					const newColors = finalColors.map(([r, g, b]) => 
						rgbToHsla(r, g, b)
					) as [string, string, string, string, string];

					colors = newColors;
				}
			} catch (error) {
				console.error('Failed to extract palette:', error);
				if (randomize) {
					colors = generateRandomColors();
				}
			}
		} else if (randomize) {
			colors = generateRandomColors();
		}

		// Auto refresh effect
		refreshInterval = setInterval(() => {
			goto('', { invalidateAll: true });
		}, 5000);
	});
	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});
	const gradientStyle = $derived({
		backgroundColor,
		backgroundImage: `
			radial-gradient(circle at var(--x-0, 40%) var(--y-0, 20%), ${colors[0]} var(--s-start-0, 0%), transparent var(--s-end-0, 50%)),
			radial-gradient(circle at var(--x-1, 80%) var(--y-1, 0%), ${colors[1]} var(--s-start-1, 0%), transparent var(--s-end-1, 50%)),
			radial-gradient(circle at var(--x-2, 0%) var(--y-2, 50%), ${colors[2]} var(--s-start-2, 0%), transparent var(--s-end-2, 50%)),
			radial-gradient(circle at var(--x-3, 80%) var(--y-3, 50%), ${colors[3]} var(--s-start-3, 0%), transparent var(--s-end-3, 50%)),
			radial-gradient(circle at var(--x-4, 0%) var(--y-4, 100%), ${colors[4]} var(--s-start-4, 0%), transparent var(--s-end-4, 50%))
		`
	});

	// Debug logging
	$effect(() => {
		console.log('AnimatedGradient - colors:', colors);
		console.log('AnimatedGradient - backgroundColor:', backgroundColor);
		console.log('AnimatedGradient - gradientStyle:', gradientStyle);
	});
</script>

<div 
	class="gradient-container {className || ''}"
	style="{Object.entries(gradientStyle).map(([key, value]) => `${key}: ${value}`).join('; ')}"
	data-colors="{JSON.stringify(colors)}"
	data-background="{backgroundColor}"
></div>

<style>
	@import "../styles/AnimatedGradient.css";
	.gradient-container {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1;
		background-blend-mode: normal, normal, normal, normal, normal;
		animation: hero-gradient-animation 15s linear infinite alternate;
		
		/* Fallback gradient in case CSS variables don't work */
		background: radial-gradient(circle at 40% 20%, hsla(328, 64%, 68%, 0.8) 0%, transparent 50%),
					radial-gradient(circle at 80% 0%, hsla(328, 84%, 92%, 0.8) 0%, transparent 50%),
					radial-gradient(circle at 0% 50%, hsla(303, 73%, 68%, 0.8) 0%, transparent 50%),
					radial-gradient(circle at 80% 50%, hsla(273, 58%, 78%, 0.8) 0%, transparent 50%),
					radial-gradient(circle at 0% 100%, hsla(331, 80%, 52%, 0.8) 0%, transparent 50%);
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
