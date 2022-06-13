import { observe } from "./observe"
import { isFunction } from "./util"

export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}
// 这个方法实现了 vm.message 获取到的是vm.data.message
function proxy (vm,key,source) { // 取值的时候做代理，不是暴力的把_data属性赋给vm 而且直接赋值会有命名冲突问题
  Object.defineProperty(vm,key, {
    set(newValue) { 
      vm[source][key] = newValue
    },
    get () {
      return vm[source][key]
    }
  })
}
function initData(vm) {
  let data = vm.$options.data // 用户传入的数据

  // 如果用户传递的是一个函数 则取函数的返回值作为对象 如果就是对象就直接使用这个对象
  // 只有根实例的data可以是一个对象

  data = vm._data = isFunction(data) ? data() : data;
  
  // 需要将data变成响应式的 Object.defineProperty 重写data中的所有属性
  observe(data) // 观测数据

  // 实例取值代理 即实现vm.message === vm.data.message
  // 由于直接遍历data属性进行重写 造成性能消耗严重，所以利用_data做一个转换 vm.data.message === vm._data.message

  for (let key in data) {
    // 对data上的数据做一次代理
    proxy(vm, key, '_data')
  }
  // console.log(data)
}

