import { createCircle, circleInstances, Circle } from "./circle";

let maxInstances: number = 100;

const circleRadius = 11;
const minVelocity = 0.1;

export const mainLoop = (deltaTime: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
	if (isNaN(deltaTime) || deltaTime <= 0) return;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (circleInstances.length < maxInstances) {
		createCircle(circleRadius);
	}

	updatePhysics(deltaTime);
	handleCollisions(canvas);
	render(ctx);
	cleanup(canvas.height);

	updateDisplay(circleInstances);
};

const updatePhysics = (deltaTime: number) => {
	for (const circle of circleInstances) {
		circle.update(deltaTime);
		// console.log(circle.x, circle.y, circle.velocityX, circle.velocityY);
	}
};

const updateDisplay = (circleInstances: Circle[]) => {
	const instanceDisplay = document.getElementById("instances");
	if (instanceDisplay) instanceDisplay.textContent = `instanced circles: ${circleInstances.length}`;
};

const handleCollisions = (canvas: HTMLCanvasElement) => {
	for (const circle of circleInstances) {
		// floor
		if (circle.y + circle.radius > canvas.height) {
			circle.y = canvas.height - circle.radius;
			circle.velocityY = -circle.velocityY * 0.8;
		}

		// ceiling
		if (circle.y - circle.radius < 0) {
			circle.y = circle.radius;
			circle.velocityY = -circle.velocityY;
		}

		// left
		if (circle.x + circle.radius > canvas.width) {
			circle.x = canvas.width - circle.radius;
			circle.velocityX = -circle.velocityX;
		}

		// right
		if (circle.x - circle.radius < 0) {
			circle.x = circle.radius;
			circle.velocityX = -circle.velocityX;
		}
	}

	for (let i = 0; i < circleInstances.length; i++) {
		for (let j = 0; j < circleInstances.length; j++) {
			if (i === j) continue;

			const a = circleInstances[i];
			const b = circleInstances[j];

			if (
				Math.abs(a.velocityX) < 0.1 &&
				Math.abs(a.velocityY) < 0.1 &&
				Math.abs(b.velocityX) < 0.1 &&
				Math.abs(b.velocityY) < 0.1
			) {
				continue;
			}

			const dx = b.x - a.x;
			const dy = b.y - a.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const minDist = a.radius + b.radius;

			if (dist < minDist) {
				const overlap = minDist - dist;
				const moveX = (overlap / 2) * (dx / dist);
				const moveY = (overlap / 2) * (dy / dist);

				a.x -= moveX;
				a.y -= moveY;
				b.x += moveX;
				b.y += moveY;

				const normalX = dx / dist;
				const normalY = dy / dist;
				const relativeVelocityX = b.velocityX - a.velocityX;
				const relativeVelocityY = b.velocityY - a.velocityY;

				const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;

				if (velocityAlongNormal > 0) continue;

				const restitution = 1.2;
				let impulse = -(5 + restitution) * velocityAlongNormal;

				const maxImpulse = 1;
				impulse = Math.min(impulse, maxImpulse);

				a.velocityX -= impulse * normalX;
				a.velocityY -= impulse * normalY;
				b.velocityX += impulse * normalX;
				b.velocityY += impulse * normalY;

				const friction = 0.68;
				a.velocityX *= friction;
				a.velocityY *= friction;
				b.velocityX *= friction;
				b.velocityY *= friction;

				if (Math.abs(a.velocityX) < minVelocity) a.velocityX = 0;
				if (Math.abs(a.velocityY) < minVelocity) a.velocityY = 0;
				if (Math.abs(b.velocityX) < minVelocity) b.velocityX = 0;
				if (Math.abs(b.velocityY) < minVelocity) b.velocityY = 0;
			}
		}
	}

	for (const circle of circleInstances) {
		if (Math.abs(circle.velocityY) < minVelocity) {
			circle.velocityY = 0;

			if (circle.y + circle.radius >= canvas.height) {
				circle.y = canvas.height - circle.radius;
			}
		}
	}
};

const render = (ctx: CanvasRenderingContext2D) => {
	for (const circle of circleInstances) {
		circle.draw(ctx);
	}
};

const cleanup = (canvasH: number) => {
	for (let i = circleInstances.length - 1; i >= 0; i--) {
		let instance = circleInstances[i];

		if (instance.y > canvasH + 50) {
			circleInstances.splice(i, 1);
		}
	}
};
