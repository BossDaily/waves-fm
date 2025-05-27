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

<div class={cn(
	"grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] absolute inset-0 -z-10 h-full w-full"
)}>
	<main class="flex flex-col gap-8 row-start-2 items-start sm:items-center">
		<WavyBackground
			className="flex flex-col items-center gap-4"
			{colors}
		>
			{#snippet children()}
				<p class="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
					Waves.FM
				</p>

				<div class="bg-white/90 p-6 rounded-lg backdrop-blur-sm w-[350px]">
					<LastFmForm />
				</div>
			{/snippet}
		</WavyBackground>
	</main>
</div>
