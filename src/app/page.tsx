import { LastFmForm } from "@/components/LastFmForm";
import { cn } from "@/lib/utils";
//import Image from "next/image";

export default function Home() {
  return (
    <div
      className={cn(
        "grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] absolute inset-0 -z-10 h-full w-full ",
        `bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#171717_1px)] bg-[size:20px_20px]`
      )}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <h1 className="z-10 whitespace-pre-wrap text-center text-4xl font-medium tracking-tighter text-white">
          Waves.FM
        </h1>
        <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm w-[350px]">
          <LastFmForm />
        </div>
      </main>
    </div>
  );
}
