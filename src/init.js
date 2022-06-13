import { compileToFunction } from "./compiler"
import { mountComponent } from "./liftcycle"
import { initState } from "./state"
import { mergeOptions, nextTick } from "./util"

export function initMixins (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = mergeOptions(vm.constructor.options,options)
    // 处理options中的数据
    initState(vm)
    if (vm.$options.el) {
      // 将数据挂载到页面上
      // console.log('页面需要挂载')
      // 数据已经被劫持了 数据变化 需要更新视图 diff算法更新需要更新的部分

      // vue ==> template ==> jsx

      // template => ast语法树（用来描述语法的，描述语法本身的） =》 描述成一个树结构 =》 将代码重组成js语法

      //模板编译原理 把template模板编译成render函数 =》 虚拟dom =》 diff算法比较虚拟dom
      // ast =》 render返回 =》 vnode =》 生成真实的dom
      //        更新的时候再次调用render =》 新的vnode =>新旧对比 =》 更新真实的dom
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    const opts = vm.$options
    el = document.querySelector(el) // 获取真实的元素
    vm.$el = el // 页面真实的元素
    if (!opts.render) {
      // 模板编译
      let template = opts.template
      if (!template) {
        template = el.outerHTML
      }
      let render = compileToFunction(template)
      opts.render = render
    }
    // 这里已经获取到了一个render函数 
    mountComponent(vm)
  }
  Vue.prototype.$nextTick = nextTick
}