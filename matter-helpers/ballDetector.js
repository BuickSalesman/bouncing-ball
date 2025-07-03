const { Events, Query, Composite } = require("matter-js")

function ballDetector(engine, mouse, mouseConstraint, ipcRenderer) {
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
}
module.exports = { ballDetector }
