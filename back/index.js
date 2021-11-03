const express = require("express");
const cors = require("cors");
const path = require("path");
const linkRouter = require("./routers/linkRouter.js")

const app = express();
app.use(cors());
app.use("/link", linkRouter)
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

