"use client"

import React, { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";

const getRandomHexColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
};

export const FullScreenGradient: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gradientRef = useRef<NeatGradient | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        gradientRef.current = new NeatGradient({
            ref: canvasRef.current,
            colors: [
                { color: getRandomHexColor(), enabled: true },
                { color: getRandomHexColor(), enabled: true },
                { color: getRandomHexColor(), enabled: true },
                { color: getRandomHexColor(), enabled: true },
                { color: getRandomHexColor(), enabled: true }
            ],
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
    }, [canvasRef.current]);

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