import { isObject } from "./util"
import { createElement, createText } from "./vdom"

export function renderMixins(Vue) {
  Vue.prototype._c = function () { // createElement 创建元素型节点
    const vm = this;
    return createElement(vm,...arguments)
  }
  Vue.prototype._v = function(text) {
    const vm = this;
    return createText(vm,text)
  }
  Vue.prototype._s = function(val) {
    // console.log('s',arguments)
    if (isObject(val)) return JSON.stringify(val)
    return val
  }
  Vue.prototype._render = function () {
     const vm = this
     const { render } = vm.$options
    //  console.log(render.toString(),vm)
     let vnode = render.call(vm)
    //  console.log(vnode)
    return vnode
  }
}