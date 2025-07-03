// matter-view.js
// @ts-check
/// <reference types="matter-js" />

const { ipcRenderer } = require("electron");
const { Engine, Render, Runner, Mouse, MouseConstraint, Composite, Bodies, Events, Query } = require("matter-js");
const { createBoundariesAndBall } = require("./matter-helpers/boundariesAndBall.js")
const { createMouseAndConstraint } = require("./matter-helpers/mouseAndConstraint.js")

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

let bodiesUnderMouse;
Events.on(mouseConstraint, "mousemove", () => {
    let { x, y } = mouse.position;
    bodiesUnderMouse = Query.point(Composite.allBodies(engine.world), { x, y });

    if (bodiesUnderMouse.length > 0 && bodiesUnderMouse[0].id < 0) {
        ipcRenderer.send("body-under");
    }

    if (bodiesUnderMouse.length === 0) {
        ipcRenderer.send("no-bodies-found");
    }
});

// this does nothing but makes sure that the wall bounds and ball are all showing up
let bodiesInWorld = new Set();
for (const body of Composite.allBodies(engine.world)) {
    bodiesInWorld.add(body);
}

//listen for added window ✅
//listen for removed window
//listen for updated bounds
//listen for updates size
//listen for not enough ball space
//listen for update fullscreen but that might be the same as ball space

let windowBodies = new Map();

//Q!!!!!
let activeWindows = [];

function updateWindows(id, bounds) {
    if (id === activeWindows[0]) {
        //check bounds and update map
        let toBack = activeWindows.shift();
        activeWindows.push(toBack);
    } else {
        if (activeWindows.includes(id) === activeWindows[1]) {
            activeWindows.shift();
            let toBack = activeWindows.shift();
            activeWindows.push(toBack);
        } else {
            activeWindows.push(id);
            windowBodies.set(id, { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height });
            let newWindow = Bodies.rectangle(
                bounds.x + bounds.width / 2,
                bounds.y + bounds.height / 2,
                bounds.width,
                bounds.height,
                {
                    isStatic: true,
                    id: id,
                    friction: 0.2,
                    render: { visible: false },
                }
            );
            Composite.add(engine.world, newWindow);
        }
    }
}

ipcRenderer.on("window-resize", (_, { id, bounds }) => {
    // we can listen for fullscreen, add, remove
    updateWindows(id, bounds);
});

ipcRenderer.on("window-drag", (_, { id, bounds }) => {
    updateWindows(id, bounds);
});

Events.on(engine, "afterUpdate", updateWindows);

module.exports = { canvas, render, engine }
