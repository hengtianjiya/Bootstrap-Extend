const path = require('path');
const fs = require('fs');
const defaultConfig = require('./config.js').config;
const webpack = require('webpack');
const es3ifyPlugin = require('es3ify-webpack-plugin'); //A simple webpack plugin to es3ify your code for old versions of ie, such as ie8.
const CleanWebpackPlugin = require('clean-webpack-plugin'); //A webpack plugin to remove/clean your build folder(s) before building
const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); //This plugin uses uglify-js to minify your JavaScript.

const src = defaultConfig.jsSrcPath;
const fileType = defaultConfig.fileTypeReg;

let entry = getEntry();
let config = {
    mode: "development",
    entry: entry,
    output: {
        path: path.join(__dirname, defaultConfig.jsDistPath),
        filename: '[name].js'
    },
    module: {
        postLoaders: [
            {
                test: /\.js$/,
                loaders: ['export-from-ie8/loader']
            }
        ],
        loaders: [
            {
                test: /\.js?$/,
                loader: "babel-loader",
                query: {
                    plugins: [
                        "transform-runtime",
                        "transform-es3-member-expression-literals",
                        "transform-es3-property-literals"
                    ],
                    presets: ['es2015', 'stage-0']
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new es3ifyPlugin(),
        new webpack.optimize.CommonsChunkPlugin("vendor.js")
    ],
    resolve: {
        alias: {
        }
    },
    devtool: 'inline-source-map'
}

if (process.env.NODE_ENV == "production") {
    config.mode = "production";
    config.devtool = '#source-map';
    config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new CleanWebpackPlugin([`${defaultConfig.jsDistPath}/*.*`]),
        new UglifyJSPlugin({
            mangle: {
                screw_ie8: false
            },
            mangleProperties: {
                screw_ie8: false,
            },
            compress: {
                screw_ie8: false,
            },
            output: {
                screw_ie8: false
            }
        })
    ]);
} else {
    config.devServer = {
        contentBase: path.join(__dirname, defaultConfig.jsDistPath),
        historyApiFallback: true,
        host: defaultConfig.devHost,
        port: defaultConfig.devPort
    }
}

module.exports = config;

function getEntry() {
    let entryMap = getFixedEntryMap(src, fileType);
    for (let k in entryMap) {
        let path = entryMap[k];
        entryMap[k] = ["es5-shim", "es5-shim/es5-sham", "babel-polyfill", path];
    }
    return entryMap;
}

function getFolderMap(dirent, src, reg) {
    let mapPath = {};
    let result = reg.exec(dirent.name);
    let fileName = result[1];
    let filePath = `${src}/${result[0]}`;
    if (fileName) {
        mapPath[fileName] = filePath;
    }
    return mapPath;
}
//规定好目录结构
function getFixedEntryMap(src, reg) {
    let mapPath = {};
    const files = fs.readdirSync(src, {
        withFileTypes: true
    });
    files.forEach(function (item) {
        if (item.isDirectory()) {
            let folerSrc = `${src}/${item.name}/index.js`;
            try {
                fs.accessSync(folerSrc, fs.constants.R_OK | fs.constants.W_OK);
                mapPath[item.name] = `${src}/${item.name}/index.js`;
            } catch (err) {
                console.log(`file ${src}/${item.name}/index.js not found`);
            }
        }
        if (item.isFile()) {
            let filePath = getFolderMap(item, src, reg);
            Object.assign(mapPath, filePath);
        }
    })
    return mapPath;
}
