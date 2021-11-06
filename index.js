const express = require("express");
const cors = require("cors");
const path = require("path");
const linkRouter = require("./back/routers/linkRouter.js");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/link", linkRouter)

app.use('/', express.static(path.resolve('./dist'))); // serve main path as static dir
app.get('/', (req, res) => { // serve main path as static file
    res.sendFile(path.resolve('./dist/index.html'))
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


