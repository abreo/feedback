var path = require('path');
var webpack = require("webpack");
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, 'js/feedback.js'),
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: 'feedback.min.js'
  },
  plugins: [
      new webpack.BannerPlugin("JKFE:zhuhuayu\nemail:294242589@qq.com\n极客提交反馈"), //  编译文件加注释
      new uglifyJsPlugin({
          compress: {
              warnings: false
          }
      })
  ],
  module: {
    loaders: [
    {
      exclude: /node_modules/,
      loader: 'babel',
      query: {
      presets: ['es2015']
      }
    },
    {
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader?limit=8192&name=images/[name].[ext]' // 这里的 limit=8192 表示用 base64 编码 <= ８K 的图像
    },
    {
      test: /\.less$/,
      loader: "style!css!less"
    }
    ]
  }
};