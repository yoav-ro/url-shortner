const fileHelper = require("../filehelper.js")

function isIdFree(id, req, res, next) {
    const urlDir = fileHelper.getUrlDir();
    for (let i = 0; i < urlDir.length; i++) {
        const currId = urlDir[i].slice(0, urlDir[i].length - 5)
        if(id===currId){
            res.status(406).json({message: `ID ${id} is already taken!` })
            return false;
        }
    }
    return true;
    next();
}

module.exports = isIdFree;