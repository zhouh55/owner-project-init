const {smart} = require('webpack-merge');
const base = require('./webpack.base');
const Webpack = require('webpack'); //自带plugin --- 有些地方有用到（热加载）
module.exports = smart(base, {
    mode:'development',
    devServer: {   //开发环境配置
        contentBase:'./dist',
        host:'localhost',
        port:3000,
        open:true,  //是否自动打开
        hot:true   //热加载  --- 还需要在plugin里面配置 webpack.HotModuleReplacementPlugin
    },
    modules:{
      rules:[
          {
              test: /\.(le|c)ss$/,            //需要less less-loader、style-loader、 css-loader
              use: [
                  'style-loader',   //使用了miniCssExtractPlugin（link形式引入），就不需要用style了
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
        new Webpack.HotModuleReplacementPlugin(), //开启热加载
    ]
});