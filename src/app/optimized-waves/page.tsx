import { AnimatedGradient } from "./AnimatedGradient";

export default function OptimizedWavesPage() {
  return (
    <main className="min-h-screen relative">
      <AnimatedGradient randomize={true} />
      <div className="relative z-10 container mx-auto p-8">
        <h1 className="text-4xl font-bold text-white mb-4">Optimized Waves</h1>
        <p className="text-white text-lg">
          This page demonstrates the animated gradient background using WebGL.
        </p>
      </div>
    </main>
  );
}
