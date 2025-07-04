

function windowCreatedOrDestroyed(overlay, currWindows, prevWindows) {
    let curr = new Set(currWindows.keys())
    let prev = new Set(prevWindows?.keys() ?? [])

    const created = [...curr].filter(id => !prev.has(id))
    const destroyed = [...prev].filter(id => !curr.has(id))

    for (const id of created) {
        const winProps = currWindows.get(id)
        console.log("sending window-created to Matter!")
        overlay.webContents.send("window-created", winProps)
    }

    for (const id of destroyed) {
        console.log("sending window-destroyed to Matter!")
        overlay.webContents.send("window-destroyed", id)
    }
}

module.exports = { windowCreatedOrDestroyed }
