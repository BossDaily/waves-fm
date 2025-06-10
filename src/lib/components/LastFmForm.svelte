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
		<Label for="apiKey" class="text-gray-100 dark:text-gray-200 font-medium text-sm uppercase tracking-wide">LastFM API Key</Label>
		<Input
			id="apiKey"
			placeholder="Enter your LastFM API key"
			bind:value={formData.apiKey}
			class="bg-white/[0.1] border-white/30 text-white placeholder:text-gray-300 focus:border-sky-400 focus:ring-sky-400/30 backdrop-blur-sm h-12 rounded-xl transition-all duration-300 hover:bg-white/[0.15] dark:bg-black/20 dark:border-white/20 dark:text-gray-100 dark:placeholder:text-gray-400 dark:hover:bg-black/30 dark:focus:border-sky-300"
		/>
		<p class="text-[0.8rem] text-gray-300 dark:text-gray-400 flex items-center">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5 text-gray-200 dark:text-gray-300"><path d="M15 6v12a3 3 0 1 0 0-6H9a3 3 0 1 0 0 6V6a3 3 0 1 0 0-6H9a3 3 0 1 0 0 6V6"/><path d="M9 18V5l12-2v13"/></svg>
			Get your API key from <a href="https://last.fm/api" target="_blank" class="text-sky-400 hover:text-sky-300 underline ml-1 dark:text-sky-300 dark:hover:text-sky-200">last.fm/api</a>
		</p>
		{#if errors.apiKey}
			<p class="text-[0.8rem] font-medium text-red-400 dark:text-red-300 flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
				{errors.apiKey}
			</p>
		{/if}
	</div>

	<div class="space-y-3">
		<Label for="username" class="text-gray-100 dark:text-gray-200 font-medium text-sm uppercase tracking-wide">LastFM Username</Label>
		<Input
			id="username"
			placeholder="Your LastFM username"
			bind:value={formData.username}
			class="bg-white/[0.1] border-white/30 text-white placeholder:text-gray-300 focus:border-sky-400 focus:ring-sky-400/30 backdrop-blur-sm h-12 rounded-xl transition-all duration-300 hover:bg-white/[0.15] dark:bg-black/20 dark:border-white/20 dark:text-gray-100 dark:placeholder:text-gray-400 dark:hover:bg-black/30 dark:focus:border-sky-300"
		/>
		{#if errors.username}
			<p class="text-[0.8rem] font-medium text-red-400 dark:text-red-300 flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
				{errors.username}
			</p>
		{/if}
	</div>

	<div class="flex flex-row items-center justify-between rounded-xl border border-white/25 bg-white/[0.1] backdrop-blur-sm p-5 hover:bg-white/[0.15] transition-all duration-300 dark:border-white/20 dark:bg-black/20 dark:hover:bg-black/30">
		<div class="space-y-1">
			<Label class="text-base text-gray-50 dark:text-gray-100 font-medium flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-sky-400 dark:text-sky-300"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
				Use Optimized Version
			</Label>
			<p class="text-[0.8rem] text-gray-300 dark:text-gray-400 pl-7">
				Enhanced performance for smoother animations
			</p>
		</div>
		<Switch bind:checked={formData.useOptimized} />
	</div>

	<Button 
		type="submit" 
		class="w-full bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 hover:from-sky-600 hover:via-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 text-base backdrop-blur-sm dark:from-sky-600 dark:via-blue-600 dark:to-purple-600 dark:hover:from-sky-700 dark:hover:via-blue-700 dark:hover:to-purple-700"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
		View Visualizer
	</Button>
</form>
