import type { RequestHandler } from "./$types.js";

function createSVG(colors: string[]) {
	const gradientId = 'waveGradient';
	
	return `
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<defs>
				<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
					${colors.map((color, index) => `
						<stop offset="${(index * 100) / (colors.length - 1)}%" style="stop-color:${color}" />
					`).join('')}
				</linearGradient>
			</defs>
			<path 
				d="M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"
				fill="none"
				stroke="url(#${gradientId})"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	`;
}

export const GET: RequestHandler = async ({ url }) => {
	const colors = [];
	
	// Get 5 colors from query params (c1 through c5)
	for (let i = 1; i <= 5; i++) {
		const color = url.searchParams.get(`c${i}`) || '#000000';
		// Validate hex color
		if (!/^#[0-9A-F]{6}$/i.test(color)) {
			return new Response('Invalid color format', { status: 400 });
		}
		colors.push(color);
	}

	const svg = createSVG(colors);

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=31536000',
		},
	});
};
