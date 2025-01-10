export const dynamic = "force-dynamic";

import { FullScreenGradient } from "@/app/waves/CanvasGradient";
import { LastFMUser } from "lastfm-ts-api";
import { Metadata } from 'next';

export async function generateMetadata(
  { searchParams }: { searchParams: { [key: string]: string | string[] | undefined } },
): Promise<Metadata> {
  const { apiKey, username } = await searchParams;
  
  const finalApiKey = apiKey as string || process.env.NEXT_PUBLIC_LASTFM;
  const finalUsername = username as string || process.env.NEXT_PUBLIC_LASTFM_USERS?.split(",")[0];

  const user = new LastFMUser(`${finalApiKey}`);
  const tracks = await user.getRecentTracks({
    user: `${finalUsername}`,
  });

  const currentTrack = tracks.recenttracks.track[0];

  return {
    title: `${currentTrack.name} - ${currentTrack.artist["#text"]}`,
    description: `Currently playing: ${currentTrack.name} by ${currentTrack.artist["#text"]} from the album ${currentTrack.album["#text"]}`,
    openGraph: {
      title: currentTrack.name,
      description: `By ${currentTrack.artist["#text"]}`,
      images: [currentTrack.image[3]["#text"]],
    },
    icons: {
      icon: [
        {
          url: `${currentTrack.image[1]["#text"]}`,
          sizes: "32x32",
          type: "image/png"
        },
        {
          url: `${currentTrack.image[1]["#text"]}`,
          sizes: "16x16",
          type: "image/png"
        }
      ],
      apple: [
        {
          url: `${currentTrack.image[1]["#text"]}`,
          sizes: "180x180",
          type: "image/png"
        }
      ],
      other: [
        {
          rel: "mask-icon",
          url: `${currentTrack.image[1]["#text"]}`
        }
      ]
    }
  };
}

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
