export function createElement (vm,tag,data = {},...children) { // 返回虚拟节点  标签
  return vnode(vm,tag,data,children,data.key,undefined)
}

export function createText (vm,val) { // 文本节点
   return vnode(vm,undefined,undefined,undefined,undefined,val)
}

function vnode(vm,tag,data,children,key,text) {
  return {
    vm,
    tag,
    data,
    children,
    key,
    text
  }
}



/* ast树和vnode树的区别
vnode 其实就是一个对象 用来描述节点的 
ast树 是用来描述语法的 并没有用户自己的逻辑 只有语法解析出来的内容
vnode是描述dom结构的 可以自己去扩展属性 */