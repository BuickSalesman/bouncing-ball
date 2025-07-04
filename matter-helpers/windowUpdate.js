const { Bodies, Composite } = require("matter-js")


function windowUpdate(world, icpRenderer) {
    icpRenderer.on("window-created", (_, winProps) => {
        console.log("window-created", winProps)
        const newWin = Bodies.rectangle(
            winProps.x + winProps.width / 2,
            winProps.y + winProps.height / 2,
            winProps.width,
            winProps.height,
            {
                id: winProps.id,
                isStatic: true
            }
        )
        Composite.add(world, newWin)

    })

    icpRenderer.on("window-destroyed", (_, id) => {
        console.log("window-destroyed", id)
        const destroyedWin = Composite.get(world, id, "body")
        Composite.remove(world, destroyedWin)
    })

    icpRenderer.on("window-update", (_, winProps) => {
        console.log("window-update", winProps)
    })
}

module.exports = { windowUpdate }   
