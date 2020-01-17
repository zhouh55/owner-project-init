const {smart} = require('webpack-merge');
const base = require('./webpack.base');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');// 让css、less以link的方式加载，css分離
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); //压缩css
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');  // 压缩js----原来使用optimize-css压缩后会破坏webpack的自带压缩的js功能
const CopyWebpackPlugin = require('copy-webpack-plugin');      // --- 把静态资源拷贝到对应的位置---（个人感觉这个可以有可无，如果是把dist包直接拿去用的话就需要）
module.exports = smart(base, {
    mode:'production',
    module:{
      rules:[
          {
              test: /\.(le|c)ss$/,            //需要less less-loader、style-loader、 css-loader
              use: [
                  {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                          publicPath:'../',      // 主要用于给css文件中添加图片文件路径
                      }
                  },
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
      ]
    },
    plugins:[
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, './resources'),
            to: path.resolve(__dirname, './dist/resources')
        }]),
        new MiniCssExtractPlugin({
            filename: './css/[name].[hash].css',
            chunkFilename: '[id].css'
        }),
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
});