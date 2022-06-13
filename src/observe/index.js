import { isArray, isObject } from "../util";
import { arrayMethods } from "./array";
import Dep from "./dep";
class Observer {
  constructor(value) {
    this.dep = new Dep() // value是对象或数组 value.__ob__.dep
    // 给对象和数组都增加dep属性
    // 添加自定义属性
    Object.defineProperty(value,'__ob__',{
      value: this,
      enumerable: false // 标识这个属性不能被列举出来 不能被循环到
    })
    // 对value进行判断 判断是否是数组
    if(isArray(value)) { // 如果是数组就改写原型链
      // 更改数组原型方法
      value.__proto__ =  arrayMethods // 重写数组的方法
      // 如果是嵌套数组 需要递归处理 [[]] [{}]
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  observeArray(data) { // 嵌套数组里面的项需要再次监听
    data.forEach(item => observe(item))
  }
  walk(data) {  
    // 循环对象
    Object.keys(data).forEach(item => {
      // 对每个属性重新定义
      defineReactive(data,item,data[item])
    })
  }
}
// vue2 应用了defineProperty 需要一加载的时候就进行递归操作，所以耗性能，如果层次过深也会浪费性能
// 性能优化的原则：
// 不要吧所有的数据都放在data中，因为所有的数据都会增加get和set
// 不要写数据的时候，层次过深，尽量扁平化数据
// 不要频繁获取数据 
// 
function  dependArray(value) {
  for(let i = 0; i < value.length; i++) {
    let current = value[i]
    current.__ob__ && current.__ob__.dep.depend()
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}
function defineReactive(obj,key,value) {
  let childOb = observe(value) // 处理嵌套的对象属性 递归进行观测数据，不管有多少层，我都进行defineProperty

  let dep = new Dep() // 操作属性都会走这个方法 所以要想给每个属性都增加dep属性 需要当前方法中操作

  Object.defineProperty(obj,key, {
    set(newValue) { // 如果设置的值是一个对象也需要再次劫持
      if (newValue === value) return 
      console.log('修改')
      observe(newValue)
      value = newValue
      dep.notify() // 拿到当前的dep中的watcher 依次更新
    },
    get () {
      // 每次属性取值的时候 将watcher放到dep上
      if (Dep.target) { // 如果当前的dep上有值 添加依赖 针对属性的依赖收集
        dep.depend()
        if (childOb) { // childOb有值 就是数组或者对象
          childOb.dep.depend() // 让数组和对象也记住当前的watcher 针对整体的依赖收集
          if (Array.isArray(value)) { // 嵌套的情况
            dependArray(value)
          }
        }
      }
      return value
    }
  })
}
export function observe(value) {
  // 如果不是对象 不做处理
  if (!isObject(value)) {
    return
  } 
  if (value.__ob__) {
    return
  }
  // 判断数据是否被观测过 避免重复观测
  return new Observer(value)
}

// 1、默认vue在初始化的时候 会对对象每一个属性进行劫持，增加dep属性，当取值的时候会做依赖收集
// 2、默认还会对属性值（对象和数组本身进行增加dep属性） 进行依赖收集
// 3、如果是属性变化 触发属性对应的dep去更新
// 4、如果是数组更新 触发数组的本身dep进行更新
// 5、如果取值的时候是数组还要让数组中的对象类型也进行依赖收集（递归依赖收集）
// 6、如果数组里面放对象，默认对象里的属性是会进行依赖收集的，因为在取值时，会进行JSON.stringify操作