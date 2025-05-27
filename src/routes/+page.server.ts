import { Vibrant } from "node-vibrant/node";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ request }) => {
	const exampleNum = Math.floor(Math.random() * 12) + 1;
	
	// Get the host from the request headers
	const host = request.headers.get("host");
	const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
	const baseUrl = `${protocol}://${host}`;
	
	try {
		const themeColor = await Vibrant.from(
			`${baseUrl}/examples/example${exampleNum}.png`
		)
			.getPalette()
			.then((palette) => palette.Vibrant?.hex || "#000000");

		return {
			themeColor
		};
	} catch (error) {
		console.error("Error generating theme color:", error);		return {
			themeColor: "#000000"
		};
	}
};
