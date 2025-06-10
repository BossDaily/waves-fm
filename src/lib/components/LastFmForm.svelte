<script lang="ts">	import { goto } from '$app/navigation';
	import { lastFmFormSchema, type LastFmFormValues } from '$lib/schemas.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';

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

<form on:submit|preventDefault={onSubmit} class="space-y-6">
	<div class="space-y-3">
		<Label for="apiKey" class="text-white/90 font-medium text-sm uppercase tracking-wide">LastFM API Key</Label>
		<Input
			id="apiKey"
			placeholder="Enter your LastFM API key"
			bind:value={formData.apiKey}
			class="bg-white/[0.07] border-white/30 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 backdrop-blur-sm h-12 rounded-xl transition-all duration-300 hover:bg-white/[0.1]"
		/>
		<p class="text-[0.8rem] text-white/60 flex items-center">
			<span class="mr-1">🔑</span>
			Get your API key from <a href="https://last.fm/api" target="_blank" class="text-blue-300 hover:text-blue-200 underline ml-1">last.fm/api</a>
		</p>
		{#if errors.apiKey}
			<p class="text-[0.8rem] font-medium text-red-300 flex items-center">
				<span class="mr-1">⚠️</span>{errors.apiKey}
			</p>
		{/if}
	</div>

	<div class="space-y-3">
		<Label for="username" class="text-white/90 font-medium text-sm uppercase tracking-wide">LastFM Username</Label>
		<Input
			id="username"
			placeholder="Your LastFM username"
			bind:value={formData.username}
			class="bg-white/[0.07] border-white/30 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/20 backdrop-blur-sm h-12 rounded-xl transition-all duration-300 hover:bg-white/[0.1]"
		/>
		{#if errors.username}
			<p class="text-[0.8rem] font-medium text-red-300 flex items-center">
				<span class="mr-1">⚠️</span>{errors.username}
			</p>
		{/if}
	</div>

	<div class="flex flex-row items-center justify-between rounded-xl border border-white/20 bg-white/[0.07] backdrop-blur-sm p-5 hover:bg-white/[0.1] transition-all duration-300">
		<div class="space-y-1">
			<Label class="text-base text-white/90 font-medium flex items-center">
				<span class="mr-2">⚡</span>
				Use Optimized Version
			</Label>
			<p class="text-[0.8rem] text-white/60">
				Enhanced performance for smoother animations
			</p>
		</div>
		<Switch bind:checked={formData.useOptimized} />
	</div>

	<Button 
		type="submit" 
		class="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 hover:from-purple-600 hover:via-blue-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 text-base backdrop-blur-sm"
	>
		<span class="mr-2">🎵</span>
		View Visualizer
	</Button>
</form>
