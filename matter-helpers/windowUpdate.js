const { Body, Bodies, Composite } = require("matter-js")


function windowUpdate(world, icpRenderer) {

    //
    //--- WINDOW CREATED ---------------------------------------------------------------- 
    //

    icpRenderer.on("window-created", (_, winProps) => {
        console.log("window-created", winProps)
        const newWin = Bodies.rectangle(
            winProps.x + winProps.width / 2,
            winProps.y + winProps.height / 2,
            winProps.width,
            winProps.height,
            {
                id: winProps.id,
                isStatic: true,
                render: {
                    visible: false
                }

            }
        )
        Composite.add(world, newWin)

    })

    //
    //--- WINDOW DESTROYED -------------------------------------------------------------- 
    //

    icpRenderer.on("window-destroyed", (_, id) => {
        console.log("window-destroyed", id)
        const destroyedWin = Composite.get(world, id, "body")
        Composite.remove(world, destroyedWin)
    })

    //
    //--- WINDOW UPDATE ----------------------------------------------------------------- 
    //

    icpRenderer.on("window-update", (_, winProps) => {
        console.log("window-update", winProps)
        const id = winProps.id
        const movedWindow = Composite.get(world, id, "body")
        if (!movedWindow) return;

        const centerX = winProps.x + winProps.width / 2;
        const centerY = winProps.y + winProps.height / 2;

        Body.setStatic(movedWindow, false);
        Body.setPosition(movedWindow, { x: centerX, y: centerY });

        const newVertices = [
            { x: centerX - winProps.width / 2, y: centerY - winProps.height / 2 },
            { x: centerX + winProps.width / 2, y: centerY - winProps.height / 2 },
            { x: centerX + winProps.width / 2, y: centerY + winProps.height / 2 },
            { x: centerX - winProps.width / 2, y: centerY + winProps.height / 2 }
        ];

        Body.setVertices(movedWindow, newVertices);
        Body.setStatic(movedWindow, true);
    });

}

module.exports = { windowUpdate }   
