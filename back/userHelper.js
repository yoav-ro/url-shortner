const User = require("./models/userModel");
const mongoose = require("mongoose");
const path = require("path")
const bcrypt = require('bcrypt')
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

mongoose.connect(process.env.DATA_BASE, { useNewUrlParser: true, })

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected!")
})


async function register(userName, password) {
    const user = await User.findOne({ username: userName })
    if (!user) {
        addUserToDB(userName, password)
    }
    else {
        throw "User name already taken!"
    }
}
function addUserToDB(userName, password) {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            const userObj = {
                username: userName,
                password: hash,
            }
            const user = new User(userObj)
            user.save();
        });
    });
}

function comparePass(encrypedPass, hash) {
    return bcrypt.compareSync(encrypedPass, hash)
}

async function validateLogin(userName, password) {
    console.log(userName, password)
    const user = await User.findOne({ username: userName })
    if (user) {
        if (comparePass(password, user.password)) {
            return true;
        }
        else {
            throw "Incorrect password"
        }
    }
    else {
        throw "User doesnt exist"
    }
}

module.exports = {
    validateLogin,
    register,
}