"use client";

import React, { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";
import useColorThief from 'use-color-thief';
import { useRouter } from 'next/navigation';
import { getRandomHexColor } from "@/lib/utils";

interface FullScreenGradientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  track: any;
}

// convert rgb values to hex color string
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
};

// generate a consistent hash from a string
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// extract a normalized parameter value from a hash at a specific index
const getParameterFromHash = (hash: number, index: number, min: number, max: number): number => {
  const value = ((hash >> (index * 8)) & 0xFF) / 255;
  return min + (value * (max - min));
};

export const FullScreenGradient: React.FC<FullScreenGradientProps> = ({ track }) => {
  // refs for canvas and gradient instances
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gradientRef = useRef<NeatGradient | null>(null);
  const router = useRouter();

  // extract album name from track data
  const albumName = track?.album['#text'];

  // extract color palette from album artwork
  const { palette } = useColorThief(track?.image[3]['#text'], {
    format: 'rgb',
    colorCount: 5,
    quality: 1,
  });

  // auto refresh effect to update current track
  useEffect(() => {
    const interval = setInterval(() => {
        router.refresh();
    }, 5000);
    return () => clearInterval(interval);
}, [router]);

  // initialize and update gradient effect
  useEffect(() => {
    if (!canvasRef.current || !albumName) return;

    // generate consistent parameters based on album name
    const hash = hashString(albumName);
    
    const parameters = {
      speed: getParameterFromHash(hash, 0, 1, 5),
      horizontalPressure: getParameterFromHash(hash, 1, 2, 5),
      verticalPressure: getParameterFromHash(hash, 2, 2, 5),
      waveFrequencyX: getParameterFromHash(hash, 3, 1, 5),
      waveFrequencyY: getParameterFromHash(hash, 4, 1, 5),
      waveAmplitude: getParameterFromHash(hash, 5, 2, 5),
    };

    // prepare color array from palette or generate random colors
    const colors = palette
      ? palette.filter((color): color is [number, number, number] => color !== null)
        .map((color) => ({
          color: rgbToHex(color[0], color[1], color[2]),
          enabled: true
        }))
      : Array(5).fill(null).map(() => ({
          color: getRandomHexColor(),
          enabled: true
        }));

    // initialize gradient with extracted colors and parameters
    gradientRef.current = new NeatGradient({
      ref: canvasRef.current,
      colors,
      speed: parameters.speed,
      horizontalPressure: parameters.horizontalPressure,
      verticalPressure: parameters.verticalPressure,
      waveFrequencyX: parameters.waveFrequencyX,
      waveFrequencyY: parameters.waveFrequencyY,
      waveAmplitude: parameters.waveAmplitude,
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

    // cleanup gradient on unmount
    return gradientRef.current.destroy;
  }, [canvasRef.current, palette, albumName]);

  // render fullscreen canvas
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
