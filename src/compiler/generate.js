const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function genProps(attrs) {
  let str = '';
  for(let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      let styles = {}
      attr.value.replace(/([^;:]+):([^;:]+)/g,function () {
        styles[arguments[1]] = arguments[2]
      })
      attr.value = styles
    }
    str += `${attr.name}: ${JSON.stringify(attr.value)},`
  }
  
  return `{${str.slice(0,-1)}}`
}
function gen(el) {
  if (el.type === 1) {
    return generate(el) // 如果是元素就递归生成
  } else {
    let text = el.text
    if (!defaultTagRE.test(text)) return `_v('${text}')` // 说明就是普通文本

    // 说明有表达式 我需要做一个表达式和普通值的拼接['aaaa',_s(name),'bbbb'].join('+')
    // _v('aaa'+_s(name)+'bbb')
    let lastIndex = defaultTagRE.lastIndex = 0 // 每次都需要重置为0
    let tokens = []
    let match;
    while(match = defaultTagRE.exec(text)) { // 如果正则+ g配合exec就会有一个问题lastIndex的问题 每次匹配完lastIndex会向前递进
      let index = match.index
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex,index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})`
  }
}
function genChildren(ast) {
  let children = ast.children
  if (children) {
    return `${children.map(c=>gen(c)).join(',')}`
  }
  return false
}
export function generate(ast) {
  let children = genChildren(ast)
  let code = `_c('${ast.tag}',${
    ast.attrs.length ? genProps(ast.attrs) : 'undefined'
  }${
    children ? `,${children}`: ''
  })`   
  return code
}