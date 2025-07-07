const { windowCreatedOrDestroyed } = require("./windowCreatedOrDestroyed.js");


function windowAABBChange(overlay, currWindows, prevWindows) {

    const moved = (curr, prev) =>
        !prev ||
        curr.x !== prev.x ||
        curr.y !== prev.y ||
        curr.width !== prev.width ||
        curr.height !== prev.height;


    for (const [currId, currProps] of currWindows) {
        const prevProps = prevWindows.get(currId)
        if (moved(currProps, prevProps)) {
            if (!prevProps) {
                windowCreatedOrDestroyed(currWindows, prevWindows)

                /*
                need an else if here to destroy window when it is too big for the
                targest ball 
                */

            } else {
                console.log(currProps.path, "new bounds: ", currProps)
                overlay.webContents.send("window-update", currProps)
            }
        }
    }

}

module.exports = { windowAABBChange }
