const { windowManager } = require("node-window-manager");
const { windowCreatedOrDestroyed } = require("./windowCreatedOrDestroyed.js")
const { windowAABBChange } = require("./windowAABBChange.js")



let prevWindows = new Map()

function trackWindows(overlay) {
    let currWindows = new Map()
    const windows = windowManager.getWindows()
    for (const win of windows) {
        const id = win.id
        const { x, y, width, height } = win.getBounds()
        const path = win.path
        const winProps = { id, x, y, width, height, path }
        currWindows.set(id, winProps)
    }
    windowCreatedOrDestroyed(overlay, currWindows, prevWindows)
    windowAABBChange(overlay, currWindows, prevWindows)

    prevWindows = currWindows
}



module.exports = { trackWindows }
