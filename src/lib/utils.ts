import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ColorThief from "colorthief";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomHexColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

// Convert RGB values to hex color string
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

// Alternative RGB to hex conversion (handles arrays)
export function rgbArrayToHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// Calculate color distance using Euclidean distance
export function calculateColorDistance(
  color1: [number, number, number], 
  color2: [number, number, number]
): number {
  const [r1, g1, b1] = color1;
  const [r2, g2, b2] = color2;
  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
}

// Get text color based on background brightness
export function getTextColor([r, g, b]: [number, number, number]): string {
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
}

// Generate a consistent hash from a string
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Extract a normalized parameter value from a hash at a specific index
export function getParameterFromHash(hash: number, index: number, min: number, max: number): number {
  const value = ((hash >> (index * 8)) & 0xFF) / 255;
  return min + (value * (max - min));
}

// Generate color variations based on a base color
export function generateColorVariation(
  baseColor: [number, number, number], 
  variationRange: number = 50
): [number, number, number] {
  return [
    Math.min(255, Math.max(0, Math.round(baseColor[0] + (Math.random() - 0.5) * variationRange))),
    Math.min(255, Math.max(0, Math.round(baseColor[1] + (Math.random() - 0.5) * variationRange))),
    Math.min(255, Math.max(0, Math.round(baseColor[2] + (Math.random() - 0.5) * variationRange)))
  ];
}

// Extract colors from album cover using ColorThief
export async function extractColorsFromImage(imageUrl: string): Promise<[number, number, number][]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    const colorThief = new ColorThief();
    
    img.onload = () => {
      try {
        // Get the dominant color first
        const dominantColor = colorThief.getColor(img, 10);
        console.log('🎯 Dominant color:', dominantColor);
        
        // Get palette of 5 colors with good quality
        const palette = colorThief.getPalette(img, 5, 10);
        console.log('🎨 Color palette:', palette);
        
        if (palette && palette.length > 0) {
          // Ensure we have the dominant color first, then the palette
          const colors: [number, number, number][] = [dominantColor as [number, number, number]];
          
          // Add palette colors that aren't too similar to dominant
          for (const color of palette) {
            const [r, g, b] = color;
            const distance = calculateColorDistance([r, g, b], dominantColor as [number, number, number]);
            
            // Only add if sufficiently different (distance > 30)
            if (distance > 30 && colors.length < 5) {
              colors.push([r, g, b] as [number, number, number]);
            }
          }
          
          // Fill remaining slots with variations if needed
          while (colors.length < 5 && colors.length > 0) {
            const baseColor = colors[0];
            const variation = generateColorVariation(baseColor);
            
            // Ensure variant is not too similar to existing colors
            const isDuplicateVariant = colors.some(existing => {
              return calculateColorDistance(variation, existing) < 30;
            });
            
            if (!isDuplicateVariant) {
              colors.push(variation);
            } else {
              console.log("Could not generate a distinct variant, using current set.");
              break;
            }
          }
          
          resolve(colors.slice(0, 5));
        } else if (dominantColor) {
          // Fallback to just dominant color if palette is empty, and generate variations
          const colors: [number, number, number][] = [dominantColor as [number, number, number]];
          while (colors.length < 5) {
            const variation = generateColorVariation(colors[0]);
            
            const isDuplicateVariant = colors.some(existing => {
              return calculateColorDistance(variation, existing) < 30;
            });
            
            if (!isDuplicateVariant) {
              colors.push(variation);
            } else {
              console.log("Could not generate a distinct variant for dominant-only, using current set.");
              break;
            }
          }
          resolve(colors.slice(0, 5));
        } else {
          console.log('❌ No dominant color or palette extracted by ColorThief.');
          resolve([]);
        }
      } catch (err) {
        console.error('ColorThief extraction failed:', err);
        reject(err);
      }
    };
    
    img.onerror = (err) => {
      console.error('Image loading failed:', err);
      reject(err);
    };
    
    img.src = imageUrl;
  });
}

// Canvas-based color extraction (alternative method)
export async function extractPaletteFromCanvas(imageUrl: string): Promise<[number, number, number][]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const colorCounts: { [key: string]: number } = {};

      // Sample every 10th pixel for performance
      for (let i = 0; i < data.length; i += 40) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const key = `${r},${g},${b}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      }

      // Get the most common colors
      const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([key]) => {
          const [r, g, b] = key.split(',').map(Number);
          return [r, g, b] as [number, number, number];
        });

      resolve(sortedColors);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}
