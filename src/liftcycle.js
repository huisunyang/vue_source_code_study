import Watcher from "./observe/watcher"
import { patch } from "./vdom/patch"

 export function  mountComponent(vm) {
  //  const { render } = vm.$options
  //  render()
  // vm._render() // 得到虚拟节点
  callHook(vm,'beforeCreate')
  let updateComponent = () => {
    vm._update(vm._render())
  } 
  // updateComponent()
  // 每个组件都有一个watcher 我们把这个watcher称之为渲染watcher
  new Watcher(vm,updateComponent, () => {
    console.log('后续增添更新的钩子函数update')
  }, true)
 }

 export function lifeCycleMixin(Vue) {
   Vue.prototype._update = function (vnode) {
     // 采用的是 先序深度遍历 创建节点 （遇到节点就创造节点 递归创建）
     const vm = this 
     vm.$el = patch(vm.$el,vnode)
   }
 }

 export function callHook (vm,hook) {
  let handles = vm.$options[hook]
  handles && handles.forEach(item => {
    item.call(vm) // 生命周期中的this永远指向实例
  })
 }

 // 生命周期 发布订阅