import { LastFMUser } from "lastfm-ts-api";
import { error } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ url }) => {
	const apiKey = url.searchParams.get("apiKey") || env.PUBLIC_LASTFM;
	const username = url.searchParams.get("username") || env.PUBLIC_LASTFM_USERS?.split(",")[0];

	if (!apiKey) {
		throw error(400, "API key is required");
	}

	if (!username) {
		throw error(400, "Username is required");
	}

	if (url.searchParams.get("username") && !url.searchParams.get("apiKey")) {
		throw error(400, "API key is required when providing a username");
	}
	try {
		const user = new LastFMUser(apiKey);
		const tracks = await user.getRecentTracks({
			user: username,
		});

		if (!tracks.recenttracks.track || tracks.recenttracks.track.length === 0) {
			throw error(404, `No recent tracks found for user: ${username}`);
		}

		const currentTrack = tracks.recenttracks.track[0];
		
		// Check if track has required fields
		if (!currentTrack.name || !currentTrack.artist || !currentTrack.image) {
			throw error(500, "Invalid track data received from Last.fm");
		}		// Use default theme color since we've moved color extraction to client-side
		const themeColor = "#000000";

		return {
			track: currentTrack,
			themeColor,
			meta: {
				title: `${currentTrack.name} - ${currentTrack.artist["#text"]}`,
				description: `Currently playing: ${currentTrack.name} by ${currentTrack.artist["#text"]} from the album ${currentTrack.album["#text"]}`,
				image: currentTrack.image[3]["#text"],
				favicon: currentTrack.image[1]["#text"]
			}
		};	} catch (err: unknown) {
		console.error("LastFM API error:", err);
		
		// Provide more specific error messages
		const errorMessage = err instanceof Error ? err.message : 'Unknown error';
		if (errorMessage.includes("User not found")) {
			throw error(404, `Last.fm user '${username}' not found. Please check the username.`);
		} else if (errorMessage.includes("Invalid API key")) {
			throw error(401, "Invalid Last.fm API key");
		} else if (err && typeof err === 'object' && 'status' in err) {
			// Re-throw SvelteKit errors
			throw err;
		} else {
			throw error(500, `Failed to fetch Last.fm data: ${errorMessage}`);
		}
	}
};
