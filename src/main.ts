import "./style.css";
import { mainLoop } from "./loop";

let fps: number = 60;
let lastTime: number = 0;
let deltaTime: number = 0;

let canvas: HTMLCanvasElement | null = null;
const canvasW: number = 700;
const canvasH: number = 600;

const main = () => {
	canvas = document.getElementById("canvas") as HTMLCanvasElement | null;

	if (!canvas) {
		console.error("canvas element not found");
		return;
	}

	canvas.height = canvasH;
	canvas.width = canvasW;

	let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
	if (!ctx) {
		console.error("failed to get 2D context");
		return;
	}

	setInterval(() => {
		return mainLoop(deltaTime, ctx, canvas!);
	}, 1000 / fps);
};

document.addEventListener("DOMContentLoaded", () => {
	main();
});

const calculateDeltaTime = () => {
	const now = performance.now();
	deltaTime = (now - lastTime) / 1000;
	lastTime = now;
};

setInterval(calculateDeltaTime, 1000 / fps);
