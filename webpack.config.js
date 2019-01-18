const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : 'Calendar.css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        })
    ],
    mode: 'production',
    entry: './src/Calendar.jsx',
    output: {
        path: path.resolve('demo/src/lib'),
        filename: 'Calendar.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [{
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                ]
            }
        ]
    }
}