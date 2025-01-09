"use client"

import { useRouter } from 'next/navigation';
import styles from './AnimatedGradient.module.css';
import { useEffect, useState } from 'react';
import useColorThief from 'use-color-thief';
//import { LastFMTrack } from 'lastfm-ts-api';

interface AnimatedGradientProps {
    colors?: [string, string, string, string, string];
    className?: string;
    track: any;
    randomize?: boolean;
}

const generateRandomHSLColor = () => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30) + 60; // 60-90%
    const l = Math.floor(Math.random() * 30) + 60; // 60-90%
    return `hsla(${h}, ${s}%, ${l}%, 1)`;
};

const generateRandomColors = (): [string, string, string, string, string] => {
    return Array.from({ length: 5 }, generateRandomHSLColor) as [string, string, string, string, string];
};

const rgbToHsla = (r: number, g: number, b: number): string => {
    // Convert RGB to [0,1] range
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    // Convert to degrees and percentages
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    const l_percent = Math.round(l * 100);

    return `hsla(${h}, ${s}%, ${l_percent}%, 1)`;
};

export function AnimatedGradient({ 
    colors: initialColors,
    className,
    track,
    randomize = false
}: AnimatedGradientProps) {
    const defaultColors = [
        'hsla(328, 64%, 68%, 1)',
        'hsla(328, 84%, 92%, 1)',
        'hsla(303, 73%, 68%, 1)',
        'hsla(273, 58%, 78%, 1)',
        'hsla(331, 80%, 52%, 1)'
    ] as [string, string, string, string, string];

    const [colors, setColors] = useState<[string, string, string, string, string]>(
        initialColors || defaultColors
    );

    const router = useRouter();

    const { palette } = useColorThief(track.image[3]['#text'], {
        format: 'rgb',
        colorCount: 10, // Get more colors than needed to ensure we have enough valid ones
        quality: 1, // Higher quality for better color extraction
    });

    // Add state for background color
    const [backgroundColor, setBackgroundColor] = useState<string>('');

    useEffect(() => {
        if (palette && palette.length > 0) {
            // Get the dominant color (first color in palette) for background
            const [r, g, b] = palette[0] as [number, number, number];
            const bgColor = rgbToHsla(r, g, b);
            setBackgroundColor(bgColor);

            // Filter out very dark or very light colors and get the 5 most vibrant ones
            const filteredColors = palette
                .slice(1) // Skip the first color as it's used for background
                .filter((color): color is [number, number, number] => {
                    if (!color) return false;
                    const [r, g, b] = color as [number, number, number];
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    return brightness > 30 && brightness < 220; // Exclude too dark or too light colors
                })
                .slice(0, 5); // Get top 5 colors

            // Ensure we have exactly 5 colors
            const finalColors = [...filteredColors];
            while (finalColors.length < 5) {
                finalColors.push(filteredColors[0] || [255, 100, 100]); // Fallback color if needed
            }

            const newColors = finalColors.map(([r, g, b]) => 
                rgbToHsla(r, g, b)
            ) as [string, string, string, string, string];

            setColors(newColors);
        } else if (randomize) {
            setColors(generateRandomColors());
        }
    }, [palette, randomize]);

    console.log(colors)
    // Auto refresh effect
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 5000);
        return () => clearInterval(interval);
    }, [router]);

    const gradientStyle = {
        backgroundColor,
        backgroundImage: `
            radial-gradient(circle at var(--x-0) var(--y-0), ${colors[0]} var(--s-start-0), transparent var(--s-end-0)),
            radial-gradient(circle at var(--x-1) var(--y-1), ${colors[1]} var(--s-start-1), transparent var(--s-end-1)),
            radial-gradient(circle at var(--x-2) var(--y-2), ${colors[2]} var(--s-start-2), transparent var(--s-end-2)),
            radial-gradient(circle at var(--x-3) var(--y-3), ${colors[3]} var(--s-start-3), transparent var(--s-end-3)),
            radial-gradient(circle at var(--x-4) var(--y-4), ${colors[4]} var(--s-start-4), transparent var(--s-end-4))
        `
    };

    return (
        <div 
            className={`${styles.gradientContainer} ${className || ''}`}
            style={gradientStyle}
        />
    );
}
