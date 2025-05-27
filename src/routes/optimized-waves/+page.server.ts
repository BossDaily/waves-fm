import { LastFMUser } from "lastfm-ts-api";
import { Vibrant } from "node-vibrant/node";
import { error } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ url }) => {
	const apiKey = url.searchParams.get("apiKey") || env.PUBLIC_LASTFM;
	const username = url.searchParams.get("username") || env.PUBLIC_LASTFM_USERS;
  console.log(username)
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
		}

		const albumCoverUrl = currentTrack.image[3]["#text"];
		
		let themeColor = "#000000";
		try {
			if (albumCoverUrl) {
				themeColor = await Vibrant.from(albumCoverUrl).getPalette().then(palette => palette.Vibrant?.hex || "#000000");
			}
		} catch (error) {
			console.error("Error extracting theme color:", error);
		}

		return {
			track: currentTrack,
			themeColor,
			meta: {
				title: `${currentTrack.name} - ${currentTrack.artist["#text"]}`,
				description: `Currently playing: ${currentTrack.name} by ${currentTrack.artist["#text"]} from the album ${currentTrack.album["#text"]}`,
				image: currentTrack.image[3]["#text"],
				favicon: currentTrack.image[1]["#text"]
			}
		};
	} catch (err: any) {
		console.error("LastFM API error:", err);
		
		// Provide more specific error messages
		if (err.message?.includes("User not found")) {
			throw error(404, `Last.fm user '${username}' not found. Please check the username.`);
		} else if (err.message?.includes("Invalid API key")) {
			throw error(401, "Invalid Last.fm API key");
		} else if (err.status) {
			// Re-throw SvelteKit errors
			throw err;
		} else {
			throw error(500, `Failed to fetch Last.fm data: ${err.message || 'Unknown error'}`);
		}
	}
};
