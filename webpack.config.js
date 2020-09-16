/**
 * YIVIC WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

// include the js minification plugin
const uglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpackBuildNotifierPlugin = require('webpack-build-notifier');

// include the css extraction and minification plugins
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const optimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

require('dotenv').config();
const webpackParams = {
    entryPath: process.env.DIR_INPUT,
    jsOutputPath: process.env.JS_OUTPUT,
    cssOutputPath: process.env.CSS_OUTPUT,
};

module.exports = {
    entry: webpackParams.entryPath,
    output: {
        filename: webpackParams.jsOutputPath,
        path: path.resolve(__dirname),
    },
    module: {
        rules: [
            // perform js babelization on all .js files
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            },
            // compile all .scss files to plain old css
            {
                test: /\.(sass|scss)$/,
                use: [miniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    }
                },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: 'postcss.config.js'
                            }
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true

                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        // extract css into dedicated file
        new miniCssExtractPlugin({
            filename: webpackParams.cssOutputPath
        }),
        new webpackBuildNotifierPlugin({
            title: "My Project Webpack Build",
            suppressSuccess: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
    ],

    optimization: {
        minimizer: [
            // enable the js minification plugin
            new uglifyJSPlugin({
                cache: true,
                parallel: true
            }),
            // enable the css minification plugin
            new optimizeCSSAssetsPlugin({})
        ]
    }
};