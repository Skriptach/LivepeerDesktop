/* eslint max-len: 0 */
import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import baseConfig from '../webpack.config.base'
import Dotenv from 'dotenv-webpack'

const port = process.env.PORT || 3000;

export default merge(baseConfig, {

	mode: 'development',

	devtool: 'cheap-module-eval-source-map',

	entry: [
		`webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
		'./app/index-electron'
	],

	output: {
		publicPath: `http://localhost:${port}/dist/`,
		libraryTarget: 'commonjs2'
	},

	plugins: [
		new Dotenv({
			path: path.resolve(process.cwd(), '.dev.env')
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	],

	target: 'electron-renderer'
});
