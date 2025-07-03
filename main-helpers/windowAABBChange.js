

function windowAABBChange(currWindows, prevWindows) {

    const moved = (curr, prev) =>
        !prev ||
        curr.x !== prev.x ||
        curr.y !== prev.y ||
        curr.width !== prev.width ||
        curr.height !== prev.height;


    for (const [currId, currProps] of currWindows) {
        const prevProps = prevWindows.get(currId)
        if (moved(currProps, prevProps)) {
            console.log(currProps.path, " new bounds: ", currProps)
        }
    }

}

module.exports = { windowAABBChange }
