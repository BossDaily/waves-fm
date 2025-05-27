<script lang="ts">
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		...restProps
	}: {
		class?: string;
	} & svelte.JSX.HTMLAttributes<HTMLLabelElement> = $props();
</script>

<label
	class={cn(
		"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
		className
	)}
	{...restProps}
>
	<slot />
</label>
