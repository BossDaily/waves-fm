import { LastFmForm } from "@/components/LastFmForm";
import { WavyBackground } from "@/components/ui/wavy-background";
import { cn, getRandomHexColor } from "@/lib/utils";
import { Metadata } from "next";
//import Image from "next/image";

const colors = [
  getRandomHexColor(),
  getRandomHexColor(),
  getRandomHexColor(),
  getRandomHexColor(),
  getRandomHexColor(),
];


export const metadata: Metadata = {
  title: "Waves.FM",
  description: "Generate animated waves from your Last.fm scrobbles",
  themeColor: colors[0],
  icons: {
    icon: [
      {
        url: `/api/favicon?${colors.map((c, i) => `c${i + 1}=${encodeURIComponent(c)}`).join('&')}`,
        sizes: "32x32",
        type: "image/png"
      },
      {
        url: `/api/favicon?${colors.map((c, i) => `c${i + 1}=${encodeURIComponent(c)}`).join('&')}`,
        sizes: "16x16",
        type: "image/png"
      }
    ],
    apple: [
      {
        url: `/api/favicon?${colors.map((c, i) => `c${i + 1}=${encodeURIComponent(c)}`).join('&')}`,
        sizes: "180x180",
        type: "image/png"
      }
    ],
    other: [
      {
        rel: "mask-icon",
        url: `/api/favicon?${colors.map((c, i) => `c${i + 1}=${encodeURIComponent(c)}`).join('&')}`
      }
    ]
  }

};
export default function Home() {
  return (
    <div
      className={cn(
        "grid grid-rows-[20px_1fr_20px]  min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] absolute inset-0 -z-10 h-full w-full ",
        ``
      )}
    >
      <main className="flex flex-col gap-8 row-start-2 items-start sm:items-center">
        <WavyBackground
          className="flex flex-col items-center gap-4"
          colors={colors}
        >
          <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
            Waves.FM
          </p>

          <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm w-[350px]">
            <LastFmForm />
          </div>
        </WavyBackground>
      </main>
    </div>
  );
}
