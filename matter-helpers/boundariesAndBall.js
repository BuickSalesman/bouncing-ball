import { Bodies } from "matter-js";

export function createBoundariesAndBall(canvasWidth, canvasHeight) {

    const ball = Bodies.circle(200, 200, 20, {
        id: -1,
        restitution: 0.8,
        friction: 0.2,
        render: { fillStyle: "blue" },
    });

    //windows do not collide with walls but balls collide with walls
    const bottom = Bodies.rectangle(canvasWidth / 2, canvasHeight + 100, canvasWidth + 100, 200, {
        isStatic: true,
        id: -2,
        friction: 0.2,
        render: { fillStyle: "white" },
    });

    const ceiling = Bodies.rectangle(canvasWidth / 2, canvasHeight - canvasHeight - 100, canvasWidth + 100, 200, {
        isStatic: true,
        id: -3,
        friction: 0.2,
        render: { fillStyle: "white" },
    });

    const left = Bodies.rectangle(-100, canvasHeight / 2, 200, canvasHeight, {
        isStatic: true,
        id: -4,
        friction: 0.2,
        render: { fillStyle: "white" },
    });

    const right = Bodies.rectangle(canvasWidth + 100, canvasHeight / 2, 200, canvasHeight, {
        isStatic: true,
        id: -5,
        friction: 0.2,
        render: { fillStyle: "white" },
    });

    return [ball, bottom, ceiling, left, right]
}
