const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: 'src/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'source-map',
    resolve: {
        modules: [
            path.resolve(__dirname, ''),
            path.resolve(__dirname, 'node_modules')
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html')
        })
    ],
}