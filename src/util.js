export function isFunction (value) {
  return typeof value === 'function'
}

export function isObject (value) {
  return typeof value === 'object' && value !== null
}

export let isArray = Array.isArray
let callbacks = []
let pending = false
function flushCallbacks () {
  callbacks.forEach(cb => cb())
  callbacks = []
  pending = false
}
export function nextTick (fn) {
  callbacks.push(fn)
  if (!pending) {
    Promise.resolve().then(flushCallbacks)
    pending = true
  }
}
let strats = { }
let lifeCycle = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
]

lifeCycle.forEach(hook => {
  strats[hook] = function (parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal)
      } else {
        if (isArray(childVal)) {
          return childVal
        } else {
           return [childVal]
        }
      }
    } else {
      return parentVal
    }
  }
})

export function mergeOptions(parentVal,childVal) {
  const options = {}
  for(let key in parentVal) {
    mergeField(key)
  }
  for(let key in childVal) {
    if (!parentVal.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  function mergeField(key) {
    const strat = strats[key]
    if (strat) {
      options[key] = strat(parentVal[key],childVal[key])
    }else {
      options[key] = childVal[key] || parentVal[key]
    }
  }
  return options
}