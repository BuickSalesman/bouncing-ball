const { Mouse, MouseConstraint } = require("matter-js");

function createMouseAndConstraint(render, engine) {
    const mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                render: {
                    visible: true,
                },
            },
        });

    return { mouse, mouseConstraint }
}

module.exports = { createMouseAndConstraint }
