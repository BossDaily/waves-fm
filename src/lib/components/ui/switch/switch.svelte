<script lang="ts">
	import { Switch as SwitchPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils";

	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		...restProps
	}: WithoutChildrenOrChild<SwitchPrimitive.RootProps> = $props();
</script>

<SwitchPrimitive.Root
	bind:ref
	bind:checked
	data-slot="switch"
	class={cn(
		// Base styles, using themed border for dark mode compatibility
		"peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-[var(--border)] outline-none transition-all focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
		// Light mode: Unchecked state with glassmorphic effect (backdrop blur and themed input background)
		"data-[state=unchecked]:bg-input/30 data-[state=unchecked]:backdrop-blur-sm",
		// Checked state background (applies to both light and dark, uses themed --primary)
		"data-[state=checked]:bg-primary",
		// Dark mode: Overrides for unchecked state with glassmorphic effect (backdrop blur and themed input background)
		"dark:data-[state=unchecked]:bg-input/50 dark:data-[state=unchecked]:backdrop-blur-sm",
		className
	)}
	{...restProps}
>
	<SwitchPrimitive.Thumb
		data-slot="switch-thumb"
		class={cn(
			"pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
			// Light mode thumb colors: unchecked uses theme background, checked uses theme primary-foreground
			"bg-background data-[state=checked]:bg-primary-foreground",
			// Dark mode thumb colors: unchecked uses theme foreground, checked uses theme primary-foreground
			"dark:bg-foreground dark:data-[state=checked]:bg-primary-foreground"
		)}
	/>
</SwitchPrimitive.Root>
