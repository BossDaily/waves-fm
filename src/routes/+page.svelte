<script lang="ts">
	import WavyBackground from "$lib/components/ui/WavyBackground.svelte";
	import LastFmForm from "$lib/components/LastFmForm.svelte";
	import { cn, getRandomHexColor } from "$lib/utils.js";
	import type { PageData } from "./$types.js";

	let { data }: { data: PageData } = $props();

	const colors = [
		getRandomHexColor(),
		getRandomHexColor(),
		getRandomHexColor(),
		getRandomHexColor(),
		getRandomHexColor(),
	];
</script>

<svelte:head>
	<title>Waves.FM</title>
	<meta name="description" content="Generate animated waves from your Last.fm scrobbles" />
	<meta property="og:title" content="Waves.FM" />
	<meta property="og:description" content="Generate animated waves from your Last.fm scrobbles" />
	<meta property="og:image" content="/examples/example{Math.floor(Math.random() * 12) + 1}.png" />
	<link rel="icon" href="/api/favicon?{colors.map((c, i) => `c${i + 1}=${encodeURIComponent(c)}`).join('&')}" />
	<meta name="theme-color" content="{data.themeColor}" />
</svelte:head>

<!-- Hero Section with Glassmorphic Design -->
<div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
	<!-- Animated Background -->
	<WavyBackground
		className="absolute inset-0 w-full opacity-60"
		{colors}
	>
		{#snippet children()}
			<div class="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-teal-900/30"></div>
		{/snippet}
	</WavyBackground>

	<!-- Floating orbs for extra ambiance -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-teal-400/15 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
		<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
	</div>

	<!-- Subtle grid pattern overlay -->
	<div class="absolute inset-0 opacity-[0.02]" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0); background-size: 20px 20px;"></div>
	<!-- Main Content -->
	<div class="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12">
		<!-- Header Section -->
		<div class="text-center mb-6 sm:mb-8">
			<!-- Logo/Title with enhanced effects -->
			<div class="inline-flex items-center justify-center mb-6">
				<div class="relative group">
					<!-- Glowing background for title -->
					<div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 blur-3xl rounded-3xl transform group-hover:scale-110 transition-transform duration-700"></div>
					
					<h1 class="relative text-4xl sm:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl dark:from-gray-100 dark:via-sky-300 dark:to-violet-300">
						Waves.FM
					</h1>
					
					<!-- Subtle reflection effect -->
					<div class="absolute inset-0 text-4xl sm:text-6xl lg:text-8xl font-bold text-white/10 blur-sm transform scale-y-[-0.3] translate-y-full dark:text-white/15"></div>
				</div>
			</div>

			<!-- Enhanced subtitle with better typography -->
			<div class="max-w-3xl mx-auto mb-4">
				<p class="text-xl sm:text-2xl lg:text-3xl text-gray-100 dark:text-gray-200 font-light leading-relaxed mb-2">
					Transform your <span class="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text font-medium dark:from-purple-300 dark:to-blue-300">Last.fm scrobbles</span>
				</p>
				<p class="text-lg sm:text-xl text-gray-300 dark:text-gray-400 font-light">
					into beautiful animated wave visualizations in real-time
				</p>
			</div>
			
			<!-- Enhanced features badges with icons -->
			<div class="flex flex-wrap justify-center gap-3 mb-8">
				<div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/15 backdrop-blur-sm border border-white/25 text-gray-50 dark:text-gray-100 hover:bg-white/20 transition-colors duration-300">
					<span class="mr-2">🎵</span>
					Real-time Updates
				</div>
				<div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/15 backdrop-blur-sm border border-white/25 text-gray-50 dark:text-gray-100 hover:bg-white/20 transition-colors duration-300">
					<span class="mr-2">🌈</span>
					Dynamic Colors
				</div>
				<div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/15 backdrop-blur-sm border border-white/25 text-gray-50 dark:text-gray-100 hover:bg-white/20 transition-colors duration-300">
					<span class="mr-2">📱</span>
					Fully Responsive
				</div>
				<div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/15 backdrop-blur-sm border border-white/25 text-gray-50 dark:text-gray-100 hover:bg-white/20 transition-colors duration-300">
					<span class="mr-2">⚡</span>
					Optimized Performance
				</div>
			</div>
		</div>

		<!-- Enhanced Glassmorphic Form Container -->
		<div class="w-full max-w-lg mx-auto">
			<div class="relative group">
				<!-- Multi-layer glow effect -->
				<div class="absolute -inset-2 bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-teal-600/30 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-1000"></div>
				<div class="absolute -inset-1 bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-teal-500/40 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
				
				<!-- Main form container with enhanced glassmorphism -->
				<div class="relative bg-white/[0.10] backdrop-blur-2xl border border-white/25 rounded-3xl p-8 sm:p-10 shadow-2xl dark:bg-black/20 dark:border-white/15">
					<!-- Subtle inner glow -->
					<div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none dark:from-white/5"></div>
					
					<!-- Form header -->
					<div class="relative text-center mb-8">
						<div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/25 to-blue-500/25 backdrop-blur-sm border border-white/25 mb-4 dark:from-purple-500/30 dark:to-blue-500/30 dark:border-white/20">
							<span class="text-3xl">🎶</span>
						</div>
						<h2 class="text-2xl sm:text-3xl font-semibold text-gray-100 dark:text-gray-100 mb-3">Get Started</h2>
						<p class="text-gray-300 dark:text-gray-300">Enter your Last.fm credentials to begin your journey</p>
					</div>
					
					<!-- Form component -->
					<div class="relative">
						<LastFmForm />
					</div>
				</div>
			</div>		</div>

		<!-- Enhanced bottom info with additional features -->
		<div class="mt-12 text-center space-y-3">
			<div class="flex justify-center space-x-6 text-gray-300 dark:text-gray-400 text-sm">
				<span class="flex items-center">
					<span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
					Live Visualization
				</span>
				<span class="flex items-center">
					<span class="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
					SvelteKit Powered
				</span>
				<span class="flex items-center">
					<span class="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
					Open Source
				</span>
			</div>
			<p class="text-gray-400 dark:text-gray-500 text-sm">
				Built with ❤️ using <span class="text-gray-200 dark:text-gray-300">SvelteKit</span> and the <span class="text-gray-200 dark:text-gray-300">Last.fm API</span>
			</p>
		</div>
	</div>
</div>
