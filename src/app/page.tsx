import { LastFmForm } from "@/components/LastFmForm";
import { cn } from "@/lib/utils";
//import Image from "next/image";

export default function Home() {
  return (
    <div
      className={cn(
        "grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] absolute inset-0 -z-10 h-full w-full ",
        `[background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]`
      )}
    >
      <main className="flex flex-col gap-8 row-start-2 items-start sm:items-start">
        <h1 className="z-10 whitespace-pre-wrap text-center text-4xl font-medium tracking-tighter text-white">
          Waves-FM
        </h1>
        <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm w-[350px]">
          <LastFmForm />
        </div>
      </main>
    </div>
  );
}
