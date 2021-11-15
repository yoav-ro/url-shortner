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
    const user = await User.find({username: userName})
    if(!user){
        addUserToDB(userName, password)
    }
    else{
        console.log("Username already taken")
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

async function login(userName, password) {
    const user = await User.findOne({ username: userName })
    if (user) {
        if (comparePass(password, user.password)) {
            console.log("Login success!")
        }
        else {
            console.log("login failed!")
        }
    }
    else
    {
        console.log("User doesnt exist!")
    }
}

function validate() {

}

function getUrls() {

}
