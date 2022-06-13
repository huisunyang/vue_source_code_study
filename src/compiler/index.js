import { generate } from "./generate";
import { parserHTML } from "./parser";

export function compileToFunction (template) {
  // 1、将模板变成ast语法树
  let ast = parserHTML(template)
  

  // 2、代码生成
  let code = generate(ast)
  let render = `with(this){return ${code}}`;
  // console.log('render',render)
  // _c('div',{style:{color:'red'}},_v('hello'+_s(name)),_c('span',undefined,''))
  let renderFn = new Function(render);
  return renderFn
  // console.log('render', code, render, renderFn)
}