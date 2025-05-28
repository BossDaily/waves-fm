import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],	optimizeDeps: {
		include: ['@firecms/neat', 'lastfm-ts-api', 'simplex-noise', 'colorthief']
	}
});
