import webpack from 'webpack'
import merge from 'webpack-merge'
import baseConfig from '../webpack.config.base'

const config = merge(baseConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    entry: './app/index-electron',
    output: {
        libraryTarget: 'commonjs2'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],

    target: 'electron-renderer'
})

export default config
