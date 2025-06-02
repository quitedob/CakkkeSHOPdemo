// vue.config.js
const path = require('path');

module.exports = {
    lintOnSave: false,
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

  // 输出文件目录
  outputDir: 'dist',

  // 静态资源目录
  assetsDir: 'static',

  // 是否使用包含运行时编译器的Vue核心构建
  runtimeCompiler: false,

  // 生产环境 sourceMap
  productionSourceMap: false,

  // 配置webpack
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@constant': path.resolve(__dirname, 'Constant')
      }
    }
  },

  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },

  // 开发服务器配置
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 后端接口地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};