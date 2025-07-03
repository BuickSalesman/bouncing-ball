const { windowManager } = require("node-window-manager");
const { windowCreatedOrDestroyed } = require("./windowCreatedOrDestroyed.js")
const { windowAABBChange } = require("./windowAABBChange.js")



let prevWindows = new Map()

function trackWindows() {
    let currWindows = new Map()
    const windows = windowManager.getWindows()
    for (const win of windows) {
        const { x, y, width, height } = win.getBounds()
        const path = win.path
        const winProps = { x, y, width, height, path }
        currWindows.set(win.id, winProps)
    }
    windowCreatedOrDestroyed(currWindows, prevWindows)
    windowAABBChange(currWindows, prevWindows)

    prevWindows = currWindows
}



module.exports = { trackWindows }
