<script lang="ts">	import { onMount, onDestroy } from "svelte";
	import * as NEAT from "@firecms/neat";
	const { NeatGradient } = NEAT;
	import { 
		getRandomHexColor, 
		rgbToHex,
		hashString,
		getParameterFromHash,
		extractPaletteFromCanvas 
	} from "$lib/utils.js";

	let {
		track
	}: {
		track: any;
	} = $props();
	let canvasRef: HTMLCanvasElement;
	let gradientRef: any = null;
	let palette: [number, number, number][] | null = null;
	const albumName = track?.album['#text'];

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
	}	onMount(async () => {
		// Extract color palette from album artwork
		if (track?.image[3]['#text']) {
			try {
				palette = await extractPaletteFromCanvas(track.image[3]['#text']);
			} catch (error) {
				console.error('Failed to extract palette:', error);
				palette = null;
			}
		}

		initializeGradient();
	});
	onDestroy(() => {
		if (gradientRef) {
			gradientRef.destroy();
		}
	});
	// Re-initialize gradient when palette changes
	$effect(() => {
		if (palette !== null) {
			initializeGradient();
		}
	});
	// Re-extract palette and re-initialize gradient when track changes
	$effect(() => {
		if (track?.image[3]['#text']) {
			(async () => {
				try {
					palette = await extractPaletteFromCanvas(track.image[3]['#text']);
				} catch (error) {
					console.error('Failed to extract palette:', error);
					palette = null;
				}
				initializeGradient();
			})();
		}
	});
</script>

<canvas
	bind:this={canvasRef}
	style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;"
></canvas>
