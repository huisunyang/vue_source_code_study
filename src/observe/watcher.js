import Dep from "./dep"
import { queueWatcher } from "./scheduler";
let id = 0;
class Watcher {
  constructor(vm,fn,cb,options) { // $watch() 要将dep放到watcher中
    this.vm = vm
    this.fn = fn
    this.cb = cb
    this.options = options
    this.id = id++
    this.depsId = new Set()
    this.deps = []

    this.getter = fn // fn就是页面渲染的逻辑
    this.get(); // 表示一上来就做一个初始化
  }
  get() {
    Dep.target = this // 将当前的watcer放到dep上
    this.getter() // 页面渲染的逻辑
    Dep.target = null // 
  }
  addDep(dep){
    let did = dep.id
    if (!this.depsId.has(did)) { // 如果当前的watcher没有记录过dep
      this.depsId.add(did)
      this.deps.push(dep) // watcher记录dep

      dep.addSub(this) // 调用dep中的方法 让dep也记住watcher
    }
  }
  update() { // 每个更新数据都会同步调用这个update方法，将更新的逻辑缓存起来，等会同步更新数据的逻辑执行完毕后，依次调用
    console.log('update')
    queueWatcher(this)
    // this.get()
  }
  run () {
    this.get()
  }
}
export default Watcher