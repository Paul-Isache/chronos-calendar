var path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/Calendar.jsx',
    output: {
        path: path.resolve('demo/src/lib'),
        filename: 'Calendar.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    }
}