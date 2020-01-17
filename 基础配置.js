const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); //最新版的需要解构赋值
const MiniCssExtractPlugin = require('mini-css-extract-plugin');// 让css、less以link的方式加载，css分離
const Webpack = require('webpack'); //自带plugin --- 有些地方有用到（热加载）
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); //压缩css
const CopyWebpackPlugin = require('copy-webpack-plugin');      // --- 把静态资源拷贝到对应的位置---（个人感觉这个可以有可无，如果是把dist包直接拿去用的话就需要）
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');  // 压缩js----原来使用optimize-css压缩后会破坏webpack的自带压缩的js功能

module.exports = {
    devServer: {   //开发环境配置
        contentBase:'./dist',
        host:'localhost',
        port:3000,
        open:true,  //是否自动打开
        hot:true   //热加载  --- 还需要在plugin里面配置 webpack.HotModuleReplacementPlugin
    },
    mode:'development',   //开发、生产配置
    entry: './src/index.js',  //入口文件
    output: {                   //出口文件，用于打包后
        path: path.resolve(__dirname, 'dist'),
        filename: "js/[name].[hash:8].js",
    },
    module: {    //由于webpack默认只能打包js文件，所以需要module的rules来对其他文件类型进行加载
        rules: [
            {
                test: /\.(le|c)ss$/,            //需要less less-loader、style-loader、 css-loader
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath:'../',      // 主要用于给css文件中添加图片文件路径
                        }
                    },
                    // 'style-loader',   //使用了miniCssExtractPlugin（link形式引入），就不需要用style了
                    'css-loader',
                    {
                        loader: 'postcss-loader',      //css自动添加前缀，必须引入autoprefixer
                        options: {
                            plugins:[require('autoprefixer')]
                        }
                    },
                    'less-loader'
                ]
            },
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
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, './resources'),
            to: path.resolve(__dirname, './dist/resources')
        }]),
        new CleanWebpackPlugin(),
        // 该插件 会把入口文件（output）的 js文件打包进去；如果是多入口文件 需要多new 一个 HtmlWebpackPlugin
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/html/index.html'),  //html模板内容
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css',
            chunkFilename: '[id].css'
        }),
        new OptimizeCssAssetsWebpackPlugin(),
        new VueLoaderPlugin(),
        new Webpack.HotModuleReplacementPlugin(), //开启热加载
    ],
    optimization:{
        minimizer:[
            new UglifyJsWebpackPlugin({
                cache:true,
                parallel:true,
                sourceMap:true
            }),
            new OptimizeCssAssetsWebpackPlugin()
        ],
        // splitChunks:{
        //     chunks:'all',
        //     cacheGroups: {
        //         libs:{
        //             name:'chunk-libs',
        //             test:/[\\/]node_modules[\\/]/,
        //             property:10,
        //             chunks: 'initial'
        //         }
        //     }
        // }
    }
};