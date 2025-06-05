import { LastFMUser } from "lastfm-ts-api";
import { error, json } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import type { RequestHandler } from "./$types.js";

export const GET: RequestHandler = async ({ url }) => {
	const apiKey = url.searchParams.get("apiKey") || env.PUBLIC_LASTFM;
	const username = url.searchParams.get("username") || env.PUBLIC_LASTFM_USERS;

	if (!apiKey) {
		throw error(400, "API key is required");
	}

	if (!username) {
		throw error(400, "Username is required");
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

		return json({
			track: currentTrack
		});
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
