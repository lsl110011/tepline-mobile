// 当前文件是Node.js执行的，只能写Node.js代码

// post-css 是一个后处理器
// 与后处理器less sass 处理之后的css在进一步处理
// 该文件是post-css的配置文件

// autoprefixer 用来处理样式兼容前缀
// postcss-pxtorem 用来将px转rem用

const { sep } = require('path')
// 如果是vant样式，则基于37.5去转（因为vant是基于375设备像素写的）px像素
// 如果我们自己去写，则基于75基准值去转换
// 转换工具以样式文件为单位进行转换
// 每一个文件的转换都要调用这个函数，我们可以为不同的文件设置不同的转换规则
// file: 文件信息对象
// dirname 当前文件的目录路径

module.exports = ({ file }) => {
  // path.sep 用于获取操作系统的路径分隔符
  const rootValue = file.dirname.indexOf(`node_modules${sep}vant`) !== -1
    ? 37.5 // vant 转换的基准值
    : 75 // 我们的设计稿转换的基准值

  return {
    plugins: {
      autoprefixer: {},
      'postcss-pxtorem': {
        rootValue,
        propList: ['*']
      }
    }
  }
}
