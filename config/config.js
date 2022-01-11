// ref: https://umijs.org/config/
import webpackPlugin from './plug.config';
import routes from './router.config';
export default {
  base: '/',
  hash: true,
  treeShaking: true,
  sass: {},
  // chainWebpack: webpackPlugin,
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'RangersChange',
        links: [
          {rel: 'icon', href: 'favicon.png'},
        ],
        dll: false,
        // pwa: {},
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
        locale: {
          enable: true,
          default: 'en-US',
          // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
      },
    ],
  ],
  proxy: {
    '/api': {
      target: 'http://47.111.5.27:7766/',
      changeOrigin: true,
      // secure: false,
    },
  },
  define: {
    // 'process.env': 'http://dev.tuntunhz.com:3001/api/',
    'process.env': 'http://192.168.2.23:3002/api/',
    'process.env.chainNet': 'dev'
  },
  theme: {
    '@primary-color': '#1890ff',
    '@border-radius-base': '0',
  },
  routes
};
