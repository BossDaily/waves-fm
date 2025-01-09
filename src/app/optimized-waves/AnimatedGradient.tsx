"use client"

import styles from './AnimatedGradient.module.css';
import { useEffect, useState } from 'react';

interface AnimatedGradientProps {
    colors?: [string, string, string, string, string];
    className?: string;
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

export function AnimatedGradient({ 
    colors: initialColors = [
        'hsla(328, 64%, 68%, 1)',
        'hsla(328, 84%, 92%, 1)',
        'hsla(303, 73%, 68%, 1)',
        'hsla(273, 58%, 78%, 1)',
        'hsla(331, 80%, 52%, 1)'
    ],
    className,
    randomize = false
}: AnimatedGradientProps) {
    const [colors, setColors] = useState(initialColors);

    useEffect(() => {
        if (randomize) {
            setColors(generateRandomColors());
        }
    }, [randomize]);

    const gradientStyle = {
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
