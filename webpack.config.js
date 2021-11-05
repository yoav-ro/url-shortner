

const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
    entry: { main: path.resolve(__dirname, "./front/index.js") },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.js",
        clean: true,
    },
    module: {
        rules: [
            { test: /.css$/, use: ["style-loader", "css-loader"] },
            { test: /.(svg|ico|png|gif|jpeg)$/, type: "asset/resource" },
        ],
    },

    plugins: [
        new HtmlWebPackPlugin({
            title: "main-page",
            filename: "index.html",
            template: path.resolve(__dirname, "./front/index.html"),
        }),
    ],
};
