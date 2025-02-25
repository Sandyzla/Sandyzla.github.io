// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({

//   transpileDependencies: true
// })


const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',  // 添加这一行
})
