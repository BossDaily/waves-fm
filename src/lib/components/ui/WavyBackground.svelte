<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { cn } from "$lib/utils.js";
	import { createNoise3D } from "simplex-noise";

	let {
		children,
		class: className,
		containerClassName,
		colors,
		waveWidth,
		backgroundFill,
		blur = 10,
		speed = "fast",
		waveOpacity = 0.5,
		...restProps
	}: {
		children?: any;
		class?: string;
		containerClassName?: string;
		colors?: string[];
		waveWidth?: number;
		backgroundFill?: string;
		blur?: number;
		speed?: "slow" | "fast";
		waveOpacity?: number;
		[key: string]: any;
	} = $props();
	let canvasRef: HTMLCanvasElement;
	let animationId: number;
	let isSafari = $state(false);

	const noise = createNoise3D();
	let w: number, h: number, nt: number, i: number, x: number, ctx: any, canvas: any;

	const getSpeed = () => {
		switch (speed) {
			case "slow":
				return 0.001;
			case "fast":
				return 0.002;
			default:
				return 0.001;
		}
	};

	const getRandomHexColor = () => {
		return (
			"#" +
			Math.floor(Math.random() * 16777215)
				.toString(16)
				.padStart(6, "0")
		);
	};

	const waveColors = colors ?? [
		getRandomHexColor(),
		getRandomHexColor(),
		getRandomHexColor(),
		getRandomHexColor(),
		getRandomHexColor(),
	];

	const drawWave = (n: number) => {
		nt += getSpeed();
		for (i = 0; i < n; i++) {
			ctx.beginPath();
			ctx.lineWidth = waveWidth || 50;
			ctx.strokeStyle = waveColors[i % waveColors.length];
			for (x = 0; x < w; x += 5) {
				var y = noise(x / 800, 0.3 * i, nt) * 100;
				ctx.lineTo(x, y + h * 0.5);
			}
			ctx.stroke();
			ctx.closePath();
		}
	};

	const render = () => {
		ctx.fillStyle = "transparent";
		ctx.globalAlpha = waveOpacity || 0.5;
		ctx.fillRect(0, 0, w, h);
		drawWave(5);
		animationId = requestAnimationFrame(render);
	};

	const init = () => {
		canvas = canvasRef;
		ctx = canvas.getContext("2d");
		w = ctx.canvas.width = window.innerWidth;
		h = ctx.canvas.height = window.innerHeight;
		ctx.filter = `blur(${blur}px)`;
		nt = 0;
		
		const handleResize = () => {
			w = ctx.canvas.width = window.innerWidth;
			h = ctx.canvas.height = window.innerHeight;
			ctx.filter = `blur(${blur}px)`;
		};
		
		window.addEventListener('resize', handleResize);
		render();
		
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	};

	onMount(() => {
		// Check for Safari
		isSafari = typeof navigator !== "undefined" &&
			navigator.userAgent.includes("Safari") &&
			!navigator.userAgent.includes("Chrome");

		const cleanup = init();
		
		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
			cleanup?.();
		};
	});

	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
	});
</script>

<div
	class={cn(
		" flex flex-col items-center justify-center",
		containerClassName
	)}
>
	<canvas
		class="absolute inset-0 z-0"
		bind:this={canvasRef}
		id="canvas"
		style={isSafari ? `filter: blur(${blur}px)` : ''}
	></canvas>
	<div class={cn("relative z-10", className)} {...restProps}>
		{@render children?.()}
	</div>
</div>