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

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

const getParameterFromHash = (hash: number, index: number, min: number, max: number): number => {
  const value = ((hash >> (index * 8)) & 0xFF) / 255;
  return min + (value * (max - min));
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
    if (!canvasRef.current || !albumName) return;

    const hash = hashString(albumName);
    
    const parameters = {
      speed: getParameterFromHash(hash, 0, 1, 5),
      horizontalPressure: getParameterFromHash(hash, 1, 2, 5),
      verticalPressure: getParameterFromHash(hash, 2, 2, 5),
      waveFrequencyX: getParameterFromHash(hash, 3, 1, 5),
      waveFrequencyY: getParameterFromHash(hash, 4, 1, 5),
      waveAmplitude: getParameterFromHash(hash, 5, 2, 5),
    };

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

    return gradientRef.current.destroy;
  }, [canvasRef.current, palette, albumName]);

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
