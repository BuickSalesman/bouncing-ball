const { windowManager } = require("node-window-manager");

const boundsMap = new Map()

function hasWindowMoved(win) {
    const current = win.getBounds()
    const previous = boundsMap.get(win.id)

    const moved = !previous ||
        current.x !== previous.x ||
        current.y !== previous.y ||
        current.width !== previous.width ||
        current.height !== previous.height

    boundsMap.set(win.id, current)
    return moved
}

function trackWindows() {
    const windows = windowManager.getWindows()
    for (const win of windows) {
        if (hasWindowMoved(win)) {
            console.log("sending window to matter.js", win, win.getBounds().x, win.getBounds().y, win.getBounds().width, win.getBounds().height)
        }
    }
}



module.exports = { trackWindows }
