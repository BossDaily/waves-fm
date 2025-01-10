export const dynamic = "force-dynamic";

import { FullScreenGradient } from "@/app/waves/CanvasGradient";
import { LastFMUser } from "lastfm-ts-api";

export default async function OptimizedWavesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { apiKey, username } = await searchParams;
  
  const finalApiKey = apiKey as string || process.env.NEXT_PUBLIC_LASTFM;
  const finalUsername = username as string || process.env.NEXT_PUBLIC_LASTFM_USERS?.split(",")[0];

  if (username && !apiKey) {
    throw new Error("API key is required when providing a username");
  }

  const user = new LastFMUser(`${finalApiKey}`);
  const tracks = await user.getRecentTracks({
    user: `${finalUsername}`,
  });

  return (
    <main className="min-h-screen relative">
      <FullScreenGradient track={tracks.recenttracks.track[0]} />
    </main>
  );
}
