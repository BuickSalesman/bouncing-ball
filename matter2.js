// matter-view.js
// @ts-check
/// <reference types="matter-js" />

const { Engine, Render, Runner, Mouse, MouseConstraint, World, Bodies } = require("matter-js");

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const engine = Engine.create();
const render = Render.create({
  canvas,
  engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: "transparent",
  },
});
Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

let mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      render: {
        visible: true,
      },
    },
  });

World.add(engine.world, mouseConstraint);

const ball = Bodies.circle(200, 200, 20, {
  render: { fillStyle: "blue" },
});

const platform = Bodies.rectangle(canvas.width / 2, canvas.height, canvas.width - 20, 100, {
  isStatic: true,
  render: { fillStyle: "white" },
});

World.add(engine.world, [ball, platform]);

console.log("matter loaded!");
