<script lang="ts">
	import { goto } from '$app/navigation';
	import { lastFmFormSchema, type LastFmFormValues } from '$lib/schemas.js';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';

	let formData: LastFmFormValues = {
		apiKey: '',
		username: '',
		useOptimized: false
	};

	let errors: Partial<Record<keyof LastFmFormValues, string>> = {};

	function validateForm(): boolean {
		try {
			lastFmFormSchema.parse(formData);
			errors = {};
			return true;
		} catch (error: any) {
			errors = {};
			if (error.errors) {
				error.errors.forEach((err: any) => {
					errors[err.path[0] as keyof LastFmFormValues] = err.message;
				});
			}
			return false;
		}
	}

	function onSubmit() {
		if (!validateForm()) return;

		const baseUrl = formData.useOptimized ? "/optimized-waves" : "/waves";
		const url = new URL(baseUrl, window.location.origin);
		url.searchParams.set("apiKey", formData.apiKey);
		url.searchParams.set("username", formData.username);
		goto(url.toString());
	}
</script>

<form on:submit|preventDefault={onSubmit} class="space-y-8">
	<div class="space-y-2">
		<Label for="apiKey">LastFM API Key</Label>
		<Input
			id="apiKey"
			placeholder="Enter your LastFM API key"
			bind:value={formData.apiKey}
		/>
		<p class="text-[0.8rem] text-muted-foreground">
			Your LastFM API key from last.fm/api
		</p>
		{#if errors.apiKey}
			<p class="text-[0.8rem] font-medium text-destructive">{errors.apiKey}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="username">LastFM Username</Label>
		<Input
			id="username"
			placeholder="Your LastFM username"
			bind:value={formData.username}
		/>
		{#if errors.username}
			<p class="text-[0.8rem] font-medium text-destructive">{errors.username}</p>
		{/if}
	</div>

	<div class="flex flex-row items-center justify-between rounded-lg border p-4">
		<div class="space-y-0.5">
			<Label class="text-base">Use Optimized Version</Label>
			<p class="text-[0.8rem] text-muted-foreground">
				Enable for enhanced performance visualization
			</p>
		</div>
		<Switch bind:checked={formData.useOptimized} />
	</div>

	<Button type="submit">View Visualizer</Button>
</form>
