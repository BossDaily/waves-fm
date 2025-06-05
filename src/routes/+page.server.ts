import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async () => {
	try {
		// Use a default theme color instead of extracting from image
		const themeColor = "#000000";

		return {
			themeColor
		};
	} catch (error) {
		console.error("Error generating theme color:", error);		return {
			themeColor: "#000000"
		};
	}
};
