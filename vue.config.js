const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // 配置一个代理，解决跨域问题
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8090",
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
})