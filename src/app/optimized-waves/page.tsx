export const dynamic = "force-dynamic";


import { LastFMUser } from "lastfm-ts-api";
import type { Metadata, ResolvingMetadata, Viewport } from 'next';
import { Vibrant } from "node-vibrant/node";
import { AnimatedGradient } from "./AnimatedGradient";


type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateViewport(
  { searchParams }: Props
): Promise<Viewport> {
  const params = await searchParams;
  const finalApiKey = params.apiKey as string || process.env.NEXT_PUBLIC_LASTFM;
  const finalUsername = params.username as string || process.env.NEXT_PUBLIC_LASTFM_USERS?.split(",")[0];

  const user = new LastFMUser(`${finalApiKey}`);
  const tracks = await user.getRecentTracks({
    user: `${finalUsername}`,
  });

  const albumCoverUrl = tracks.recenttracks.track[0].image[3]["#text"];
  const themeColor = await Vibrant.from(albumCoverUrl).getPalette().then(palette => palette.Vibrant?.hex || "#000000");
  console.log(themeColor)

  return {
    themeColor,
  };
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await searchParams;
  const finalApiKey = params.apiKey as string || process.env.NEXT_PUBLIC_LASTFM;
  const finalUsername = params.username as string || process.env.NEXT_PUBLIC_LASTFM_USERS?.split(",")[0];

  const user = new LastFMUser(`${finalApiKey}`);
  const tracks = await user.getRecentTracks({
    user: `${finalUsername}`,
  });

  const currentTrack = tracks.recenttracks.track[0];
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${currentTrack.name} - ${currentTrack.artist["#text"]}`,
    description: `Currently playing: ${currentTrack.name} by ${currentTrack.artist["#text"]} from the album ${currentTrack.album["#text"]}`,
    openGraph: {
      images: [currentTrack.image[3]["#text"], ...previousImages],
      title: `Generated animated waves from the song: ${currentTrack.name}`,
      description: `By ${currentTrack.artist["#text"]} on the album ${currentTrack.album["#text"]}`,
    },
    icons: {
      icon: [
        { url: currentTrack.image[1]["#text"], sizes: "32x32", type: "image/png" },
        { url: currentTrack.image[1]["#text"], sizes: "16x16", type: "image/png" }
      ],
      apple: [
        { url: currentTrack.image[1]["#text"], sizes: "180x180", type: "image/png" }
      ],
      other: [
        { rel: "mask-icon", url: currentTrack.image[1]["#text"] }
      ]
    }
  };
}

export default async function OptimizedWavesPage({ searchParams }: Props) {
  const params = await searchParams;
  const finalApiKey = params.apiKey as string || process.env.NEXT_PUBLIC_LASTFM;
  const finalUsername = params.username as string || process.env.NEXT_PUBLIC_LASTFM_USERS?.split(",")[0];

  if (params.username && !params.apiKey) {
    throw new Error("API key is required when providing a username");
  }

  const user = new LastFMUser(`${finalApiKey}`);
  const tracks = await user.getRecentTracks({
    user: `${finalUsername}`,
  });

  return (
    <main className="min-h-screen relative">
      <AnimatedGradient track={tracks.recenttracks.track[0]} randomize={true} />
    </main>
  );
}
