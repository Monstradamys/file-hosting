const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './frontend/js/client.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'backend/frontbundle')
    },
    module: {
        rules: [
            {
               test: /\.pug$/,
               use: {
                   loader: 'pug-loader',
                   options: {
                       pretty: true
                   }
               } 
            },
            {
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './frontend/views/index.pug'
        }),
        new ExtractTextPlugin('bundle.css'),
        new CleanWebpackPlugin(),
    ]
}