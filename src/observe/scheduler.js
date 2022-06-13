import { nextTick } from "../util"

 let has = {}
 let queue = []
 let pending = false
 function flushSchedulerQueue() {
  queue.forEach(watcher => {
    watcher.run()
  })
   has = {}
   queue = []
   pending = false
 }
 export function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    has[id] = true
    queue.push(watcher)
    if (!pending) {
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
 }