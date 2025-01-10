"use client";

import React, { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";
import useColorThief from 'use-color-thief';
import { useRouter } from 'next/navigation';


interface FullScreenGradientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  track: any;
}

const getRandomHexColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
};

export const FullScreenGradient: React.FC<FullScreenGradientProps> = ({ track }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gradientRef = useRef<NeatGradient | null>(null);
  const router = useRouter();

  const albumName = track?.album['#text'];

  const { palette } = useColorThief(track?.image[3]['#text'], {
    format: 'rgb',
    colorCount: 5,
    quality: 1,
  });



  useEffect(() => {
    const interval = setInterval(() => {
        router.refresh();
    }, 5000);
    return () => clearInterval(interval);
}, [router]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const colors = palette
      ? palette.map((color: [number, number, number]) => ({
          color: rgbToHex(color[0], color[1], color[2]),
          enabled: true
        }))
      : Array(5).fill(null).map(() => ({
          color: getRandomHexColor(),
          enabled: true
        }));

    gradientRef.current = new NeatGradient({
      ref: canvasRef.current,
      colors,
      speed: 4,
      horizontalPressure: 4,
      verticalPressure: 5,
      waveFrequencyX: 2,
      waveFrequencyY: 3,
      waveAmplitude: 5,
      shadows: 0,
      highlights: 1,
      colorSaturation: 0,
      colorBrightness: 1,
      wireframe: false,
      colorBlending: 6,
      backgroundAlpha: 0,
      resolution: 1 / 3,
      grainIntensity: 0,
    });

    return gradientRef.current.destroy;
  }, [canvasRef.current, palette]);

  return (
    <canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
      ref={canvasRef}
    />
  );
};
