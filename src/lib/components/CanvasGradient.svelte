<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { goto } from "$app/navigation";
	import { NeatGradient } from "@firecms/neat";
	import { getRandomHexColor } from "$lib/utils.js";

	let {
		track
	}: {
		track: any;
	} = $props();

	let canvasRef: HTMLCanvasElement;
	let gradientRef: NeatGradient | null = null;
	let palette: [number, number, number][] | null = null;
	let refreshInterval: number;

	const albumName = track?.album['#text'];

	// Convert rgb values to hex color string
	const rgbToHex = (r: number, g: number, b: number): string => {
		return '#' + [r, g, b]
			.map(x => x.toString(16).padStart(2, '0'))
			.join('');
	};

	// Generate a consistent hash from a string
	const hashString = (str: string): number => {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		return Math.abs(hash);
	};

	// Extract a normalized parameter value from a hash at a specific index
	const getParameterFromHash = (hash: number, index: number, min: number, max: number): number => {
		const value = ((hash >> (index * 8)) & 0xFF) / 255;
		return min + (value * (max - min));
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

				// Get the most common colors
				const sortedColors = Object.entries(colorCounts)
					.sort((a, b) => b[1] - a[1])
					.slice(0, 5)
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

	function initializeGradient() {
		if (!canvasRef || !albumName) return;

		// Generate consistent parameters based on album name
		const hash = hashString(albumName);
		
		const parameters = {
			speed: getParameterFromHash(hash, 0, 1, 5),
			horizontalPressure: getParameterFromHash(hash, 1, 2, 5),
			verticalPressure: getParameterFromHash(hash, 2, 2, 5),
			waveFrequencyX: getParameterFromHash(hash, 3, 1, 5),
			waveFrequencyY: getParameterFromHash(hash, 4, 1, 5),
			waveAmplitude: getParameterFromHash(hash, 5, 2, 5),
		};

		// Prepare color array from palette or generate random colors
		const colors = palette
			? palette.filter((color): color is [number, number, number] => color !== null)
				.map((color) => ({
					color: rgbToHex(color[0], color[1], color[2]),
					enabled: true
				}))
			: Array(5).fill(null).map(() => ({
					color: getRandomHexColor(),
					enabled: true
				}));

		// Clean up previous gradient
		if (gradientRef) {
			gradientRef.destroy();
		}

		// Initialize gradient with extracted colors and parameters
		gradientRef = new NeatGradient({
			ref: canvasRef,
			colors,
			speed: parameters.speed,
			horizontalPressure: parameters.horizontalPressure,
			verticalPressure: parameters.verticalPressure,
			waveFrequencyX: parameters.waveFrequencyX,
			waveFrequencyY: parameters.waveFrequencyY,
			waveAmplitude: parameters.waveAmplitude,
			shadows: 0,
			highlights: 1,
			colorSaturation: 0,
			colorBrightness: 1,
			wireframe: false,
			colorBlending: 6,
			backgroundAlpha: 0,
			resolution: 1 / 3,
			grainIntensity: 0,
		});
	}

	onMount(async () => {
		// Extract color palette from album artwork
		if (track?.image[3]['#text']) {
			try {
				palette = await extractPalette(track.image[3]['#text']);
			} catch (error) {
				console.error('Failed to extract palette:', error);
				palette = null;
			}
		}

		initializeGradient();

		// Auto refresh effect to update current track
		refreshInterval = setInterval(() => {
			// In SvelteKit, we need to navigate to refresh the page data
			goto('', { invalidateAll: true });
		}, 5000);
	});

	onDestroy(() => {
		if (gradientRef) {
			gradientRef.destroy();
		}
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});

	// Re-initialize gradient when palette changes
	$: if (palette !== null) {
		initializeGradient();
	}
</script>

<canvas
	bind:this={canvasRef}
	style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;"
/>
