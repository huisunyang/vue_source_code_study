import { initGlobalAPI } from "./global-api";
import { initMixins } from "./init";
import { lifeCycleMixin } from "./liftcycle";
import { renderMixins } from './render'
// vue采用的是原型模式，所有的功能都通过原型扩展的方式来添加
function Vue (options) {
  // 初始化数据
  this._init(options)
}

initMixins(Vue)
renderMixins(Vue)
lifeCycleMixin(Vue)
initGlobalAPI(Vue)
// 将vue导出去给别人用
export default Vue


// 1、new Vue会调用_init方法进行初始化操作
// 2、会将用户的选项放到vm.$options上
// 3、会在当前属性上搜索有没有data数据
// 4、有data 判断data是函数还是对象 函数取返回值作为对象 对象直接返回
// 5、observe 监听data 观测data中的数据 和vm没关系 说明data已经变成了响应式
// 6、vm上取值也能取到data中的数据 vm._data = data 这样用户也能取到data了 vm._data


// 如果有el 需要挂载到页面上 



// 组件渲染 每个属性都有一个dep
// 1、vue里面用到了观察者模式，默认组件渲染的时候，会创建一个watcher（并且会渲染视图）
// 2、当渲染视图的时候，会取data中的数据，会走每个属性的get方法 ，就让这个属性的dep记录watcher
// 3、同时让watcher也记住dep   dep和watcher是多对多的关系，因为一个属性可能对应多个视图 一个视图对应多个数据
// 4、如果数据发生变化，会通知对应属性的dep 依次通知存放的watcher取更新