import { LastFmForm } from "@/components/LastFmForm";
import { WavyBackground } from "@/components/ui/wavy-background";
import { cn } from "@/lib/utils";
//import Image from "next/image";

export default function Home() {
  return (
    <div
      className={cn(
        "grid grid-rows-[20px_1fr_20px]  min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] absolute inset-0 -z-10 h-full w-full ",
        ``
      )}
    >
      <main className="flex flex-col gap-8 row-start-2 items-start sm:items-center">
        <WavyBackground className="flex flex-col items-center gap-4">
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
