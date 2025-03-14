// import { getRandomHexColor } from "./utils";

const earthGravity = 9.81;
const saturnGravity = 10.44;
const dampingFactor = 0.99;

export const circleInstances: Circle[] = [];

export class Circle {
	x: number;
	y: number;
	radius: number;
	color: string;
	velocityY: number;
	velocityX: number;

	constructor(x: number, y: number, radius: number) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = "#FFF";
		this.velocityX = 0;
		this.velocityY = 0;
	}

	update(deltaTime: number) {
		this.velocityY += earthGravity * deltaTime;
		this.y += this.velocityY;
		this.x += this.velocityX;

		this.velocityX *= dampingFactor;
		this.velocityY *= dampingFactor;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

export const createCircle = (circleRadius: number): void => {
	const newCircle = new Circle(
		Math.floor(Math.random() * 800),
		Math.floor(Math.random() * 50),
		circleRadius
	);
	circleInstances.push(newCircle);
};
