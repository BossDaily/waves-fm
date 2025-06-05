<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { LinkRemover } from '$lib/utils/linkRemover';

	interface Props {
		targetHref?: string;
		checkInterval?: number;
		showLogs?: boolean;
	}

	let { 
		targetHref = "https://neat.firecms.co", 
		checkInterval = 1000,
		showLogs = false 
	}: Props = $props();

	let remover: LinkRemover;
	let removedCount = $state(0);
	let isActive = $state(true);

	onMount(() => {
		remover = new LinkRemover(targetHref);
		
		// Override the removeExistingLinks method to track count
		const originalRemove = (remover as any).removeExistingLinks.bind(remover);
		(remover as any).removeExistingLinks = () => {
			const links = document.querySelectorAll(`a[href="${targetHref}"]`);
			const count = links.length;
			if (count > 0) {
				removedCount += count;
				if (showLogs) {
					console.log(`🗑️ LinkGuard: Removed ${count} unwanted links (total: ${removedCount})`);
				}
			}
			originalRemove();
		};

		remover.start();
	});

	onDestroy(() => {
		if (remover) {
			remover.stop();
		}
	});

	function toggle() {
		if (isActive) {
			remover.stop();
			isActive = false;
		} else {
			remover.start();
			isActive = true;
		}
	}

	function manualScan() {
		const links = document.querySelectorAll(`a[href="${targetHref}"]`);
		links.forEach(link => link.remove());
		if (links.length > 0) {
			removedCount += links.length;
		}
	}
</script>

{#if showLogs}
	<div class="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-sm z-50 max-w-xs">
		<div class="flex items-center gap-2 mb-2">
			<div class="w-2 h-2 rounded-full {isActive ? 'bg-green-400' : 'bg-red-400'}"></div>
			<span class="font-medium">Link Guard</span>
		</div>
		
		<div class="space-y-1 text-xs">
			<div>Target: <code class="bg-white/20 px-1 rounded">{targetHref}</code></div>
			<div>Removed: <span class="font-mono">{removedCount}</span></div>
			<div>Status: <span class="{isActive ? 'text-green-400' : 'text-red-400'}">{isActive ? 'Active' : 'Inactive'}</span></div>
		</div>

		<div class="flex gap-1 mt-2">
			<button 
				onclick={toggle}
				class="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors"
			>
				{isActive ? 'Stop' : 'Start'}
			</button>
			<button 
				onclick={manualScan}
				class="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
			>
				Scan Now
			</button>
		</div>
	</div>
{/if}
