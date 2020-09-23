// 设置代理,允许进行跨域访问
module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: 'http://127.0.0.1:5000',
        // target: 'http://192.168.0.108:5000',
        changeOrigin: true,
        pahtRewrite: {
          '^/': '/'
        }
      }
    }
  }
}