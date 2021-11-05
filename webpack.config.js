const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: "./front/index.js",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "./"
    },
    plugins: [new HtmlWebpackPlugin({
        template: "./front/index.html"
    })],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: "asset/resource",
            },
        ]
    },
}