const { windowManager } = require("node-window-manager");
const { windowCreatedOrDestroyed } = require("./windowCreatedOrDestroyed.js")
const { windowAABBChange } = require("./windowAABBChange.js")


const boundsMap = new Map()
// look into idle polling here
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
let prevWindows = new Map()

function trackWindows() {
    let currWindows = new Map()
    const windows = windowManager.getWindows()
    for (const win of windows) {
        const { x, y, width, height } = win.getBounds()
        const path = win.path
        const winProps = { x, y, width, height, path }
        currWindows.set(win.id, winProps)
        // send new windows
        // send closed window
        // send moved window
        // send resized with check for too big or now small enough
        // send too big window
        // 


    }
    //windowCreatedOrDestroyed(win, currWindows, prevWindows)
    //windowAABBChange(win, currWindows, prevWindows)

    prevWindows = currWindows
}



module.exports = { trackWindows }
