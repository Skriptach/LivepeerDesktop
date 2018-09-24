import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import baseConfig from '../webpack.config.base'
import Dotenv from 'dotenv-webpack'

const config = merge(baseConfig, {
	mode: 'production',
	devtool: 'cheap-module-source-map',
	entry: './app/index-electron',
	output: {
		libraryTarget: 'commonjs2'
	},
	plugins: [
		new Dotenv({
			path: path.resolve(process.cwd(), '.prod.env')
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
	],

	target: 'electron-renderer'
})

export default config
