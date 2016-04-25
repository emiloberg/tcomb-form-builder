'use strict'; //eslint-disable-line

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssNested = require('postcss-nested');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const I18nPlugin = require('i18n-webpack-plugin');

const DEBUG = process.env.NODE_ENV === 'development';
const TEST = process.env.NODE_ENV === 'test';
const PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * CSS Selector Name
 *
 * When in production/development mode - make each css selector name
 * (e.g .myClassName, #myId, etc) unique. However, this makes it hard to test,
 * so when running in test mode - changes the behaviour so that the
 * selector names are the actual selectors names (and can be tested).
 */
const cssSelectorName = TEST ? '[local]' : '[name]__[local]___[hash:base64:5]';

/**
 * CSS/JS Bundle Filenames
 *
 * Add hash to filename, when building for production,
 * to bust caches.
 */
const cssBundleFilename = PRODUCTION ? 'bundle.[contenthash].css' : 'bundle.css';
const jsBundleFilename = PRODUCTION ? 'bundle.js' : 'bundle.js';


/**
 * List of node_modules to parse for (S)CSS
 * By default, all 'node_modules' subfolders are not
 * parsed for (S)CSS.
 */
const modulesParseCSS = [

];

/**
 * Loaders, JSX.
 */
const jsxLoader = [];
if (DEBUG) {
	jsxLoader.push('react-hot');
}
jsxLoader.push('babel-loader');

/**
 * Loaders, SCSS.
 */
let scssLoader;
let scssLoaderParts = [
	'style',
	'css-loader?sourceMap&modules&importLoaders=1&localIdentName=' + cssSelectorName + '',
	'postcss-loader',
	'sass?sourceMap'
];
if (PRODUCTION) {
	scssLoaderParts = scssLoaderParts.slice(1).join('!'); // Remove 'style'
	scssLoader = ExtractTextPlugin.extract('style', scssLoaderParts);
} else {
	scssLoader = scssLoaderParts.join('!');
}

/**
 * Plugins
 */
const plugins = [
	new webpack.DefinePlugin({
		DEBUG: JSON.stringify(DEBUG),
		TEST: JSON.stringify(TEST),
		PRODUCTION: JSON.stringify(PRODUCTION),
		'process.env': {
			NODE_ENV: JSON.stringify(process.env.NODE_ENV)
		}
	}),
	new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ar.js/) // Removing all locales but Arabic from Moment.js
];
if (DEBUG) {
	plugins.push(new webpack.HotModuleReplacementPlugin());
} else if (PRODUCTION) {
	plugins.push(new ExtractTextPlugin(cssBundleFilename, { allChunks: true }));
	plugins.push(new HtmlWebpackPlugin({
		title: 'React Boilerplate',
		filename: 'index.html',
		template: 'index.prod.html'
	}));
	plugins.push(new webpack.optimize.DedupePlugin());
	plugins.push(new webpack.optimize.UglifyJsPlugin({
		comments: false
	}));
}

/**
 * Entry
 */
const entry = {
	bundle: ['./src/root']
};
if (DEBUG) {
	entry.bundle.push('webpack-dev-server/client?http://localhost:3000');
	entry.bundle.push('webpack/hot/only-dev-server');
}

/**
 * Dev Tool (source maps, etc)
 */
let devtool;
if (DEBUG) {
	devtool = 'eval-source-map';
} else if (TEST) {
	devtool = 'inline-source-map';
} else if (PRODUCTION) {
	devtool = 'source-map';
}


/**
 * External packages
 *
 * List of packages which should *not* be included in the bundle,
 * but rather loaded witch a separate <script> tag. E.g. from a CDN.
 */
const externals = {};
if (PRODUCTION) {
	externals.react = 'React';
	externals.immutable = 'Immutable';
}

const preLoaders = [];
if (TEST) {
	preLoaders.push({
		test: /\.jsx?$/,
		exclude: [/node_modules/, /\.spec\.jsx?/],
		loader: 'isparta-instrumenter-loader'
	});
}
if (DEBUG || TEST) {
	preLoaders.push({
		test: /\.jsx?$/,
		loader: 'eslint-loader',
		exclude: /node_modules/
	});
}

/**
 * Webpack Configuration
 */
module.exports = {
	devtool,
	entry,
	output: {
		path: path.join(__dirname, '../dist'),
		filename: jsBundleFilename
	},
	plugins,
	externals,
	module: {
		preLoaders,
		loaders: [{
			test: /\.jsx?$/,
			loaders: jsxLoader,
			exclude: /node_modules/
		}, {
			test: /(\.scss|\.css)$/,
			loader: scssLoader,
			exclude: new RegExp('node_modules\/(?!' + modulesParseCSS.join('|') + ')')
		}]
	},
	resolve: {
		root: path.resolve(__dirname, '..'),
		alias: {
			api: 'src/api',
			components: 'src/components',
			reducers: 'src/reducers',
			utils: 'src/utils',
			sagas: 'src/sagas',
			selectors: 'src/selectors',
			store: 'src/store',
			style: 'src/style',
			ducks: 'src/ducks',
			helpers: 'src/helpers',
			Index: DEBUG ? 'src/index.dev.jsx' : 'src/index.prod.jsx',
			'react-dom': 'node_modules/react-dom/dist/react-dom.min',
			tcombTemplate: 'src/tcomb-form-template'
		},
		extensions: ['', '.js', '.json', '.jsx', '.scss']
	},
	postcss: [
		postcssNested,
		autoprefixer()
	]
};
