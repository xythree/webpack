const webpack = require("webpack")
const path = require("path")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin") //Gzip 压缩
const SpritesmithPlugin = require("webpack-spritesmith")
const production = (process.env.NODE_ENV == "production")

module.exports = {
    entry: {
        //vendor: ["vue", "axios"],
        bundle: [
            "webpack-dev-server/client?http://localhost:8888/", //webpack-dev-server 热更时需要
            "./src/js/main.js"
        ]
    },
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: "[name].js",
        //filename: "[name].[chunkhash:8].js",
        //chunkFilename: path.resolve(__dirname, "dist/js/[name].min.js") //路由懒加载时，命名文件名需要
    },
    //devtool: "source-map",
    plugins: [
        //new UglifyJSPlugin(),
        /*
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.(js|otf|eot|svg|ttf|woff|woff2)$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        */
        /*
        new ExtractTextPlugin({
            filename: "../css/[name].css",
            allChunks: true
        }),
        */
        new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: path.resolve(__dirname, "./src/images"),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: path.resolve(__dirname, "dist/sprites/sprite.png"),
                css: path.resolve(__dirname, "dist/sprites/sprite.css")
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: "sprite.png" //css根据该指引找到sprite图
            },
            spritesmithOptions: {
                algorithm: 'top-down'
            }
        })
    ],
    module: {
        rules: [{
                test: /\.js$/,
                loader: "babel-loader?cacheDirectory=true",
                exclude: /mode_modules/
            },
            /*
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader", "postcss-loader"]
                })

            },
            */
            {
                test: /\.(css|scss)$/,
                use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"]
            },
            {
                test: /\.vue$/,
                use: [{
                    loader: "vue-loader",
                    // exclude: /node_modules\/(?!(autotrack|dom-utils))|vendor\.dll\.js/,
                    options: {
                        //extractCSS: true,
                        postcss: function() {
                            return [require("autoprefixer")({ browsers: ["last 5 versions"] })];
                        }
                    }
                }]
            },
            {
                test: /\.(gif|jpg|png)\??.*$/,
                //loader: "url-loader?limit=1024&name=https://www.xythree.com/[name].[ext]"
                loader: "url-loader?limit=1024"
            }
        ]
    },
    resolve: {
        //extensions: [".js", ".json", ".vue", ".css"],
        //引用路径别名
        alias: {
            "vue$": "vue/dist/vue.common.js",
            "$sprite": path.resolve(__dirname, "dist/sprites"),
            "$css": path.resolve(__dirname, "src/css"),
            "$js": path.resolve(__dirname, "src/js")
        }
    }
}