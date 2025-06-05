<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { linkRemover } from '$lib/utils/linkRemover';

	let { children } = $props();

	onMount(() => {
		// Start the link remover when the app loads
		linkRemover.start();
	});

	onDestroy(() => {
		// Stop the link remover when the app is destroyed
		linkRemover.stop();
	});
</script>

<main class="h-full">
	{@render children()}
</main>
