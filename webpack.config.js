const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './frontend/js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'backend/frontbundle')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './backend/frontbundle'
    },
    watch: true,
    watchOptions: {
        poll: 1000,
        ignored: /node_modules/
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: 'babel-loader'
            },
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
        new ExtractTextPlugin('bundle.css')
    ]
}