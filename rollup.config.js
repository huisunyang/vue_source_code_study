import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve';
export default {
  input: './src/index.js', // 打包入口
  output: {
    file: 'dist/vue.js', // 打包出口
    format: 'umd', //  常见的格式 IIFE ESM CJS UMD
    name: 'Vue', // umd模块需要配置name，会将导出的模块放到window上
    sourcemap: true // 可以进行源码调试
  },
  plugins: [
    resolve(),
    babel({
      exclude:'node_modules/**' // 去除node_modules下的所有文件
    })
  ]
}