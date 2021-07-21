const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const historyApiFallback = require('connect-history-api-fallback');
const autoprefixer = require('autoprefixer');
const dotenv = require('dotenv');

// call dotenv and it will return an Object with a parsed key 
const env = dotenv.config().parsed;
  
// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
    entry: './src/app.js',
    output: {
        path: __dirname + '/dist',
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    //resolve-url-loader may be chained before sass-loader if necessary 
                    use: [{
                        loader: 'css-loader' //  interprets @import and url() like import/require() and will resolve them.
                    },
                    {
                        loader: 'postcss-loader', // postcss loader so we can use autoprefixer
                        options: {
                            plugins: function () {
                                return [autoprefixer]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader' // compiles Sass to CSS
                    }]
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader' //  interprets @import and url() like import/require() and will resolve them.
                    },
                    {
                        loader: 'postcss-loader', // postcss loader so we can use autoprefixer
                        options: {
                            plugins: function () {
                                return [autoprefixer]
                            }
                        }
                    }
                    ]
                })
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    "file-loader?name=[name]-[hash:6].[ext]&outputPath=cssImages/",
                    //If you want higher quality images, comment out "image-webpack-loader" below
                    "image-webpack-loader"
                ]
            },
            {
                test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'   // where the fonts will go
                    }
                }]
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin("app.css"),
        new BrowserSyncPlugin({
            // browse to http://localhost:3000/ during development, 
            // ./public directory is being served 
            //proxy: 'dnndev.me',
            //port: 3000,
            //Addition files to watch that Webpack isn't aware of:
            files: "**/*.ascx,**/*.cshtml,**/*.html",
            server: {
                baseDir: './',
                middleware: [ historyApiFallback() ]
            },
            https: true,
            port: 3000
        }),
        new webpack.ProvidePlugin({
            //Assuming jQuery is Provided By DNN...
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default']
        }),
        new webpack.DefinePlugin(envKeys)
    ]
}