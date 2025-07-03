// @ts-check
/// <reference types="matter-js" />

const { ipcRenderer } = require("electron");
const { Engine, Render, Runner, Composite, Bodies, Events, Query } = require("matter-js");
const { createBoundariesAndBall } = require("./matter-helpers/boundariesAndBall.js")
const { createMouseAndConstraint } = require("./matter-helpers/mouseAndConstraint.js")
const { ballDetector } = require("./matter-helpers/ballDetector.js")

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

const { mouse, mouseConstraint } = createMouseAndConstraint(render, engine)
Composite.add(engine.world, mouseConstraint);

const boundariesAndBall = createBoundariesAndBall(canvas.width, canvas.height);
Composite.add(engine.world, boundariesAndBall);

ballDetector(engine, mouse, mouseConstraint, ipcRenderer)


//listen for added window ✅
//listen for removed window
//listen for updated bounds
//listen for updates size
//listen for not enough ball space
//listen for update fullscreen but that might be the same as ball space



// Events.on(engine, "afterUpdate", updateWindows);

module.exports = { canvas, render, engine }
