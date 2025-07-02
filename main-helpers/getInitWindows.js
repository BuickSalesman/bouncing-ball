const { windowManager } = require("node-window-manager");

function getInitWindows() {
    return windowManager.getWindows()
}



module.exports = { getInitWindows } 
