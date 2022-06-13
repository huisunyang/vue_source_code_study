let oldArrayPrototype = Array.prototype
export let arrayMethods = Object.create(oldArrayPrototype) // 让arrayMethods 通过__prtoto__能获取到数组的方法

let methods = [
  'pop',
  'unshift',
  'push',
  'shift',
  'reverse',
  'sort',
  'splice'
]

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    // 数组新增的属性要看一下是不是对象 如果是对象 也要劫持

    // 需要调用数组的原生逻辑
    oldArrayPrototype[method].call(this,...args)
    // 可以添加自己逻辑 函数劫持 切片
    let inserted = null
    let ob = this.__ob__;
    switch (method) {
      case 'splice':
        inserted = args.slice(2)
        break;
      case 'push':
      case 'unshift': 
       inserted = args
    }
    if (inserted) ob.observeArray(inserted)
    ob.dep.notify()
  }
})

