import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import baseConfig from '../webpack.config.base'
import Dotenv from 'dotenv-webpack'

export default merge(baseConfig, {
    mode: 'production',
    devtool: 'source-map',

    entry: ['babel-polyfill', './main.dev'],

    output: {
        path: __dirname,
        filename: '../main.js',
        libraryTarget: 'commonjs2'
    },

    plugins: [
        new Dotenv({
            path: path.resolve(process.cwd(), '.prod.env')
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                ecma: 8,
                warnings: false
            }
        }),
        new webpack.BannerPlugin(
            {
                banner: 'require("source-map-support").install();var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;',
                raw: true,
                entryOnly: false
            }
        )
    ],

    target: 'electron-main',

    node: {
        __dirname: false,
        __filename: false
    },

    externals: [
        'font-awesome',
        'source-map-support',
        'request',
        'mailgun-js'
    ]
})
