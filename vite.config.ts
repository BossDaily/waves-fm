import { sveltekit } from '@sveltejs/kit/vite';
import icons from 'unplugin-icons/vite';
import kitDocs from '@svelteness/kit-docs/node';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [icons({ compiler: 'svelte' }), kitDocs(), tailwindcss(), sveltekit()],
	optimizeDeps: {
		include: ['@firecms/neat', 'lastfm-ts-api', 'simplex-noise', 'colorthief']
	}
});
