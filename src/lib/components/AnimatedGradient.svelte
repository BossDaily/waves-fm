<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { goto } from "$app/navigation";
	import { getRandomHexColor } from "$lib/utils.js";
	import Vibrant from "node-vibrant";

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
	// Extract colors using Vibrant package for better color analysis
	async function extractPalette(imageUrl: string): Promise<[number, number, number][]> {
		try {
			console.log('🎨 Extracting palette using Vibrant from:', imageUrl);
			const startTime = performance.now();
			
			const vibrant = new Vibrant(imageUrl, {
				colorCount: 8, // Extract more colors for better selection
				quality: 1 // Higher quality for better color detection
			});
			
			const palette = await vibrant.getPalette();
			const endTime = performance.now();
			console.log(`⏱️ Vibrant extraction took ${(endTime - startTime).toFixed(2)}ms`);
			
			// Extract colors in order of vibrancy and usefulness for gradients
			const extractedColors: [number, number, number][] = [];
			
			// Priority order: most vibrant and visually appealing colors first
			const colorPriority = [
				'Vibrant',
				'DarkVibrant', 
				'LightVibrant',
				'Muted',
				'DarkMuted',
				'LightMuted'
			];
			
			for (const colorKey of colorPriority) {
				const color = palette[colorKey as keyof typeof palette];
				if (color) {
					const rgb = color.rgb;
					const [r, g, b] = rgb;
					
					// Filter out colors that are too similar to already extracted ones
					const isDuplicate = extractedColors.some(existing => {
						const distance = Math.sqrt(
							Math.pow(r - existing[0], 2) +
							Math.pow(g - existing[1], 2) +
							Math.pow(b - existing[2], 2)
						);
						return distance < 50; // Minimum distance threshold
					});
					
					if (!isDuplicate) {
						console.log(`🌈 ${colorKey}: RGB(${r}, ${g}, ${b}) - Population: ${color.population}`);
						extractedColors.push([Math.round(r), Math.round(g), Math.round(b)]);
					}
				}
			}
			
			// If we don't have enough colors, add some enhanced variants
			while (extractedColors.length < 5 && extractedColors.length > 0) {
				const baseColor = extractedColors[extractedColors.length % extractedColors.length];
				const variant = createColorVariant(baseColor);
				extractedColors.push(variant);
				console.log(`⚡ Added enhanced variant: RGB(${variant[0]}, ${variant[1]}, ${variant[2]})`);
			}
			
			// Fallback if no colors were extracted
			if (extractedColors.length === 0) {
				console.log('❌ No colors extracted by Vibrant, using fallback palette');
				return [
					[80, 120, 160],
					[160, 80, 120], 
					[120, 160, 80],
					[140, 100, 180],
					[180, 140, 100]
				];
			}
			
			console.log(`🎯 Successfully extracted ${extractedColors.length} colors using Vibrant`);
			return extractedColors.slice(0, 5); // Ensure we return exactly 5 colors max
			
		} catch (error) {
			console.error('💥 Vibrant extraction failed:', error);
			// Fallback to a nice default palette
			return [
				[80, 120, 160],
				[160, 80, 120],
				[120, 160, 80], 
				[140, 100, 180],
				[180, 140, 100]
			];
		}
	}
	// Create enhanced color variants using HSL manipulation
	function createColorVariant([r, g, b]: [number, number, number]): [number, number, number] {
		// Convert RGB to HSL for easier manipulation
		const hsl = rgbToHsl(r, g, b);
		
		// Apply harmonic color theory shifts for pleasing variants
		const harmonicShifts = [30, 45, 60, 90, 120]; // Musical intervals
		const shift = harmonicShifts[Math.floor(Math.random() * harmonicShifts.length)];
		
		hsl[0] = (hsl[0] + shift) % 360; // Shift hue
		hsl[1] = Math.min(90, Math.max(30, hsl[1] + (Math.random() - 0.5) * 20)); // Vary saturation
		hsl[2] = Math.min(80, Math.max(25, hsl[2] + (Math.random() - 0.5) * 15)); // Vary lightness
		
		return hslToRgb(hsl[0], hsl[1], hsl[2]);
	}

	// Convert RGB to HSL
	function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
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
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		return [h * 360, s * 100, l * 100];
	}

	// Convert HSL to RGB  
	function hslToRgb(h: number, s: number, l: number): [number, number, number] {
		h /= 360;
		s /= 100;
		l /= 100;

		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1/6) return p + (q - p) * 6 * t;
			if (t < 1/2) return q;
			if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		const r = hue2rgb(p, q, h + 1/3);
		const g = hue2rgb(p, q, h);
		const b = hue2rgb(p, q, h - 1/3);

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	// Enhanced helper to convert Vibrant palette to gradient colors
	function paletteToColors(palette: [number, number, number][] | null): [string, string, string, string, string] {
		console.log('🎨 Converting Vibrant palette to gradient colors:', palette);
		
		if (!palette || palette.length === 0) {
			console.log('❌ No palette provided, generating random colors');
			const randomColors = generateRandomColors();
			console.log('🎲 Generated random colors:', randomColors);
			return randomColors;
		}

		console.log('✅ Processing Vibrant palette with', palette.length, 'colors');
		
		// Vibrant already gives us good colors, but let's enhance them for gradients
		const enhancedColors = palette.map(([r, g, b], index) => {
			const hsl = rgbToHsl(r, g, b);
			
			// Enhance for gradient visibility
			hsl[1] = Math.min(85, Math.max(35, hsl[1] * 1.15)); // Boost saturation slightly
			hsl[2] = Math.max(30, Math.min(80, hsl[2])); // Ensure good lightness range
			
			const enhanced = hslToRgb(hsl[0], hsl[1], hsl[2]);
			console.log(`🌈 Enhanced color ${index}: RGB(${r}, ${g}, ${b}) → RGB(${enhanced[0]}, ${enhanced[1]}, ${enhanced[2]})`);
			return enhanced;
		});

		// Ensure we have exactly 5 colors
		const finalColors = [...enhancedColors];
		while (finalColors.length < 5) {
			const baseColor = finalColors[finalColors.length % finalColors.length];
			const variant = createColorVariant(baseColor);
			finalColors.push(variant);
			console.log(`⚡ Added color variant: RGB(${variant[0]}, ${variant[1]}, ${variant[2]})`);
		}

		// Convert to HSLA strings
		const hslaColors = finalColors.slice(0, 5).map(([r, g, b]) => {
			const hslaColor = rgbToHsla(r, g, b);
			console.log(`🎊 RGB(${r}, ${g}, ${b}) → HSLA ${hslaColor}`);
			return hslaColor;
		}) as [string, string, string, string, string];

		console.log('🎉 Final Vibrant-based gradient colors:', hslaColors);
		return hslaColors;
	}
	// Extract palette and update colors when track changes
	async function updateColorsFromTrack() {
		console.log('🚀 Updating colors for track:', track?.name, 'by', track?.artist?.['#text']);
		
		if (track?.image?.[3]?.['#text']) {
			console.log('🖼️ Extracting palette from image using Vibrant:', track.image[3]['#text']);
			try {
				const newPalette = await extractPalette(track.image[3]['#text']);
				console.log('🎨 Vibrant extracted palette:', newPalette);
				
				if (newPalette && newPalette.length > 0) {
					console.log('🎯 Using Vibrant palette with', newPalette.length, 'colors');
					palette = newPalette;
					
					// Use the first (most vibrant) color as background with reduced opacity
					const [r, g, b] = newPalette[0] as [number, number, number];
					const hsl = rgbToHsl(r, g, b);
					// Make background color darker and less saturated for better contrast
					hsl[1] = Math.max(20, hsl[1] * 0.6); // Reduce saturation
					hsl[2] = Math.max(15, hsl[2] * 0.4); // Make much darker
					const [bgR, bgG, bgB] = hslToRgb(hsl[0], hsl[1], hsl[2]);
					const bgColor = rgbToHsla(bgR, bgG, bgB);
					
					console.log(`🏠 Background color: Original RGB(${r}, ${g}, ${b}) → Adjusted RGB(${bgR}, ${bgG}, ${bgB}) → HSLA ${bgColor}`);
					backgroundColor = bgColor;
					colors = paletteToColors(newPalette);
				} else {
					console.log('❌ Vibrant extraction returned empty result');
					if (randomize) {
						console.log('🎲 Falling back to random colors');
						colors = generateRandomColors();
					}
				}
			} catch (error) {
				console.error('💥 Failed to extract palette with Vibrant:', error);
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
	}onMount(() => {
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
