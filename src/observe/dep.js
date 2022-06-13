let id = 0

class Dep {
  constructor () { // 要将watcher放到dep中
    this.subs = []
    this.id = id++ 
  }
  depend() {
    // 要给watcher添加一个标识 防止重复收集
    // this.subs.push(Dep.target) // 让dep记住这个watcher watcher也要记住dep 
    // Dep.target就是一个watcher watcher记住了dep
    Dep.target.addDep(this) // 在watcher中调用dep的addSub方法
  }
  addSub(watcher) {
    this.subs.push(watcher) // 让dep记住watcher
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}
Dep.target = null // 这里使用一个全局的变量 window.target 静态属性
export default Dep