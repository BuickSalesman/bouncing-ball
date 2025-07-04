

function windowUpdate(world, icpRenderer) {
    icpRenderer.on("window-created", (_, winProps) => {
        console.log("window-created", winProps)
    })

    icpRenderer.on("window-destroyed", (_, winProps) => {
        console.log("window-destroyed", winProps)
    })

    icpRenderer.on("window-update", (_, winProps) => {
        console.log("window-update", winProps)
    })
}

module.exports = { windowUpdate } 
