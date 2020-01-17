const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); //最新版的需要解构赋值
const Webpack = require('webpack'); //自带plugin --- 有些地方有用到（热加载）
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
    entry: './src/index.js',  //入口文件
    output: {                   //出口文件，用于打包后
        path: path.resolve(__dirname, 'dist'),
        filename: "js/[name].[hash:8].js",
    },
    module: {    //由于webpack默认只能打包js文件，所以需要module的rules来对其他文件类型进行加载
        noParse:/jquery/,// 不去解析里面的依赖项
        rules: [
            {            //处理文件 主要用到 file-loader --- url-loader使用于将小图片进行转化
                         //url-loader 处理图片 有集成file-loader
                test: /\.(png|jpe?g|svg|gif)$/,  //css文件中的
                use: [
                    {
                        loader:  'url-loader',  //其实只用file-loader就可以了
                        options: {
                            limit:10240,   //小于该大小的将会转为base64，并且不会存在实体图
                            fallback:{
                                loader:'file-loader',
                                options:{
                                    name:'images/[name].[hash:8].[ext]'
                                }
                            },
                            esModule:false          //重点，这个不设置false的话 会和html img路径打包loader冲突
                        }
                    }
                ]
            },
            {
                test:/\.(ttf|woff|otf|eot|woff2)$/,    //处理文字
                use: {
                    loader: 'file-loader',
                    options: {
                        name:'font/[name].[hash].[ext]'
                    }
                }
            },
            {
                test: /\.html$/,
                use: ['html-withimg-loader']
            },
            {
                test: /\.vue$/,
                use:['vue-loader']
            },
            {
                test:/\.js$/,
                use:{
                    loader: 'babel-loader',    //babel 需要下载多个 babel-loader | @babel/preset-env | @babel/core
                    //如果要使用 @babel/plugin-transform-runtime(把特别的ES5语法提取到公共的地方，减少代码体积)
                    //  还需要安装@babel/runtime @babel/runtime-corejs2
                    // options: {               // 通常是直接 在 .babelrc（等于 options） 文件中直接配置
                    //     presets:['@babel/preset-env']
                    // }
                },
                exclude: /node_modules/,  //不打包依赖里面的js
                include: path.resolve(__dirname, 'src'), //只打包src下面的js文件
            }
        ]
    },
    resolve:{    //模块解析
        alias: {
            'vue$':'vue/dist/vue.runtime.esm.js',
        },
        extensions: ['.vue', '.js', 'less', '.json', '.css'],  //在引入（import、require）的时候不带这些后缀名
    },
    plugins: [
        new CleanWebpackPlugin(),
        // 该插件 会把入口文件（output）的 js文件打包进去；如果是多入口文件 需要多new 一个 HtmlWebpackPlugin
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/html/index.html'),  //html模板内容
        }),
        new VueLoaderPlugin()
    ]
};