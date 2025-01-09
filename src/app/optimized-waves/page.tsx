import { AnimatedGradient } from "./AnimatedGradient";
import { LastFMUser } from "lastfm-ts-api";


export default async function OptimizedWavesPage() {
  const user = new LastFMUser(`${process.env.LASTFM}`);
  const tracks = await user.getRecentTracks({
    user: `${process.env.LASTFM_USERS?.split(",")[0]}`,
  });
 
  return (
    <main className="min-h-screen relative">
      <AnimatedGradient randomize={true} />
      <div className="relative z-10 container mx-auto p-8">
        <h1 className="text-4xl font-bold text-white mb-4">{tracks.recenttracks.track[0].artist["#text"]}</h1>
        <p className="text-white text-lg">
            {tracks.recenttracks.track[0].name} - {tracks.recenttracks.track[0].album["#text"]}
        </p>
      </div>
    </main>
  );
}
