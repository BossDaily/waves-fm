<script lang="ts">
	import WavyBackground from "$lib/components/ui/WavyBackground.svelte";
	import LastFmForm from "$lib/components/LastFmForm.svelte";
	import { cn, getRandomHexColor } from "$lib/utils.js";
	import type { PageData } from "./$types.js";

	let { data }: { data: PageData } = $props();

	const colors = [
		'#FF00FF', // Neon Pink
		'#00FFFF', // Cyan
		'#FF00AA', // Hot Pink
		'#0000FF', // Electric Blue
		'#FFD700'  // Gold (for sunset highlights)
	];

	const currentYear = new Date().getFullYear();
</script>

<svelte:head>
	<title>Waves.FM</title>
	<meta name="description" content="Generate animated waves from your Last.fm scrobbles" />
	<meta property="og:title" content="Waves.FM" />
	<meta property="og:description" content="Generate animated waves from your Last.fm scrobbles" />
	<meta property="og:image" content="/examples/example{Math.floor(Math.random() * 12) + 1}.png" />
	<link rel="icon" href="/api/favicon?{colors.map((c, i) => `c${i + 1}=${encodeURIComponent(c)}`).join('&')}" />
	<meta name="theme-color" content="#200020" />
</svelte:head>

<!-- Hero Section with Synthwave Design -->
<div class="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-pink-700 to-orange-500">
	<!-- Animated Background -->
	<!-- <WavyBackground
		className="absolute inset-0 w-full opacity-60"
		{colors}
	>
		{#snippet children()}
			<div class="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-teal-900/30"></div>
		{/snippet}
	</WavyBackground> -->

	<!-- Floating orbs for synthwave ambiance -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-pink-500/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/25 to-blue-500/25 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
		<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-400/30 to-red-500/30 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
	</div>

	<!-- Neon Grid Overlay -->
	<div class="absolute inset-0 opacity-20" style="background-image: linear-gradient(to right, rgba(0, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 255, 0.5) 1px, transparent 1px); background-size: 40px 40px;"></div>

	<!-- Main Content -->
	<div class="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12">
		<!-- Header Section -->
		<div class="text-center mb-6 sm:mb-8">
			<!-- Logo/Title with enhanced effects -->
			<div class="inline-flex items-center justify-center mb-6">
				<div class="relative group">
					<!-- Glowing background for title -->
					<div class="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-orange-500/30 blur-3xl rounded-3xl transform group-hover:scale-110 transition-transform duration-700"></div>
					
					<h1 class="relative text-4xl sm:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-pink-400 via-cyan-300 to-orange-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,0,255,0.7)] dark:from-pink-300 dark:via-cyan-200 dark:to-orange-200">
						Waves.FM
					</h1>
					
					<!-- Subtle reflection effect -->
					<div class="absolute inset-0 text-4xl sm:text-6xl lg:text-8xl font-bold text-white/20 blur-sm transform scale-y-[-0.3] translate-y-full dark:text-white/25">Waves.FM</div>
				</div>
			</div>

			<!-- Enhanced subtitle with better typography -->
			<div class="max-w-3xl mx-auto mb-4">
				<p class="text-xl sm:text-2xl lg:text-3xl text-gray-100 dark:text-gray-50 font-light leading-relaxed mb-2">
					Transform your Last.fm scrobbles
				</p>
				<p class="text-lg sm:text-xl text-gray-100 dark:text-gray-200 font-light">
					into beautiful animated wave visualizations in real-time
				</p>
			</div>
			
			<!-- Enhanced features badges with icons -->
			<div class="flex flex-wrap justify-center gap-3 mb-8">
				<div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-black/30 backdrop-blur-sm border border-pink-500/50 text-pink-200 hover:bg-black/40 hover:border-pink-400 transition-colors duration-300">
					<span class="mr-2">🎵</span>
					Real-time Updates
				</div>
				<div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-black/30 backdrop-blur-sm border border-cyan-500/50 text-cyan-200 hover:bg-black/40 hover:border-cyan-400 transition-colors duration-300">
					<span class="mr-2">🌈</span>
					Dynamic Colors
				</div>
				<div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-black/30 backdrop-blur-sm border border-purple-500/50 text-purple-200 hover:bg-black/40 hover:border-purple-400 transition-colors duration-300">
					<span class="mr-2">📱</span>
					Fully Responsive
				</div>
				<div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-black/30 backdrop-blur-sm border border-orange-500/50 text-orange-200 hover:bg-black/40 hover:border-orange-400 transition-colors duration-300">
					<span class="mr-2">⚡</span>
					Optimized Performance
				</div>
			</div>
		</div>

		<!-- Enhanced Glassmorphic Form Container -->
		<div class="w-full max-w-lg mx-auto">
			<div class="relative group">
				<!-- Multi-layer glow effect -->
				<div class="absolute -inset-2 bg-gradient-to-r from-pink-600/40 via-purple-600/40 to-orange-600/40 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-1000"></div>
				<div class="absolute -inset-1 bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-orange-500/50 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-all duration-700"></div>
				
				<!-- Main form container with enhanced glassmorphism -->
				<div class="relative bg-black/[0.25] backdrop-blur-xl border border-pink-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl dark:bg-black/30 dark:border-pink-400/50">
					<LastFmForm />
				</div>
			</div>
		</div>

		<!-- Enhanced bottom info with additional features -->
		<div class="mt-12 text-center space-y-3">
			<p class="text-gray-200 dark:text-gray-300 text-sm">
				Crafted with <span class="text-pink-300 dark:text-pink-200">SvelteKit</span> & the <span class="text-cyan-300 dark:text-cyan-200">Last.fm API</span>
			</p>
			<p class="text-gray-300 dark:text-gray-300 text-xs pt-4">
				© bossdaily {currentYear}
			</p>
		</div>
	</div>
</div>
