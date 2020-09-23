'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        '/distriapi': {
            target: 'https://opentest.kaikeba.com/mos',
            changeOrigin: true,
            secure: true, // 如果是https接口，需要配置这个参数
            pathRewrite: {
                '^/distriapi': ''
            }
        },
        '/opencourseapi': {
            target: 'https://opentest.kaikeba.com',
            changeOrigin: true,
            secure: true, // 如果是https接口，需要配置这个参数
            pathRewrite: {
                '^/opencourseapi': ''
            }
        },
        '/api': {
            target: 'https://opentest.kaikeba.com',
            changeOrigin: true,
            secure: true, // 如果是https接口，需要配置这个参数
            pathRewrite: {
                '^/api': ''
            }
        },
        '/s1': {
            target: 'https://api2test.kaikeba.com',
            changeOrigin: true,
            pathRewrite: {
                '^/s1': ''
            }
        },
        '/learn': {
            target: 'http://test-inner-api-passport.kaikeba.com',
            changeOrigin: true,
            pathRewrite: {
                '^/learn': ''
            }
        },
    },

    // Various Dev Server settings
      host: 'localhost', // can be overwritten by process.env.HOST
    // host: '10.20.29.81', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true

  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    // assetsPublicPath: '/',
    assetsPublicPath: '/', // /opencourseurl/


    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
