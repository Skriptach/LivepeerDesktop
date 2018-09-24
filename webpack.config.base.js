import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;

export default {
	mode: 'development',
	module: {
		rules: [{
			test: /\.jsx?$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		}, {
			test: /\.svg$/,
			loader: 'svg-inline-loader'
		}, {
			test: /^((?!\.global).)*\.css$/,
			loader: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'postcss-loader'
			})
		}
		]
	},
	output: {
		path: path.join(__dirname, './dist'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		mainFields: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
	},
	plugins: [
		new CopyWebpackPlugin([
			{ from: './app/static', to: path.join(__dirname, './dist/static') }
		]),
		new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),
		new DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		})
	]
}
