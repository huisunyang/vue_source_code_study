// 将虚拟节点变成真实节点
   export function patch(el,vnode) {
     // 删除老节点 根据vnode创建新节点 替换掉老节点
     const elm = createElm(vnode) // 根据虚拟节点创建真实节点
     const parentNode = el.parentNode
     parentNode.insertBefore(elm,el.nextSibling) // el.nextSibling不存在就是null 如果为null insertBefore就是appendChild
     parentNode.removeChild(el)
     return elm
   }
  
  /* 面试题 虚拟节点的实现 =》 如何将虚拟节点渲染成真实的节点 */
   function createElm (vnode) {
     let { tag, data, children,text} = vnode
     if (typeof tag === 'string') { // 根据tag的类型判断是否是文本节点
       vnode.el = document.createElement(tag) // 创建节点
       // 如果data有属性 我们需要将data上的属性设置到元素上
       updateProperties(vnode.el,data)
       children.forEach(child => {
        vnode.el.appendChild(createElm(child))
       })
     } else {
      vnode.el = document.createTextNode(text) // 创建文本节点
     }
    //  console.log('el',vnode)
     return vnode.el
   }
 function updateProperties(el,props = {}) {
  for (let key in props) {
    if (key === 'style') {
      for (let styleName in props[key]) {
        el.style[styleName] = props[key][styleName]
      }
    } else if (key === 'class') {
      el.className = props[key]
    } else {
      el.setAttribute(key,props[key])
    }
  }
 }