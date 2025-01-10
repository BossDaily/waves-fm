export const dynamic = "force-dynamic";
import { FullScreenGradient } from "@/components/MeshGradients/CanvasGradient";

import { LastFMTrack, LastFMUser } from "lastfm-ts-api";
export default async function OptimizedWavesPage() {
  const user = new LastFMUser(`${process.env.NEXT_PUBLIC_LASTFM}`);
  const tracks = await user.getRecentTracks({
    user: `${process.env.NEXT_PUBLIC_LASTFM_USERS?.split(",")[0]}`,
  });

  return (
    <main className="min-h-screen relative">
      <FullScreenGradient track={tracks.recenttracks.track[0]} />
      {/* <div className="relative z-10 container mx-auto p-8">
        <h1 className="text-4xl font-bold text-white mb-4">Optimized Waves</h1>
        <p className="text-white text-lg">
          This page demonstrates the animated gradient background using WebGL.
        </p>
      </div> */}
    </main>
  );
}
