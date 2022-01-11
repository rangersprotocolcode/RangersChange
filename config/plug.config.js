const webpackPlugin = (config) => {
  if(process.env.NODE_ENV == 'production'){
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          minChunks: 1,
          automaticNameDelimiter: '.',
          name: true,
          cacheGroups: {
            vendors: {
              name: 'vendors',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|lodash|dva|moment|web3|bignumber|@ethereumjs)[\\/]/,
              priority: 10,
            },
            antdesigns: {
              name: 'antdesigns',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
              priority: 10,
            },
          },
        }
      }
    })
  }
}

export default webpackPlugin;