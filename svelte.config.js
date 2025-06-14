import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],

	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
      "@/*": "./path/to/lib/*",
    },
	}
	
};

export default config;
