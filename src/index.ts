import { Listeners } from './types'
import { isString, isFunction, objectEmptyCheck } from './utils'

class EventBus {
  private _listeners: Listeners

  constructor() {
    this._listeners = Object.create(null)
  }

  on(type: string, cb: Function): Function {
    if (__DEV__) {
      if (!isString(type)) { throw new TypeError('Parameter 1 is not a string') }
      if (!isFunction(cb)) { throw new TypeError('Parameter 2 is not a function') }
    }
    (this._listeners[type] || (this._listeners[type] = [])).push(cb)
    const self = this
    return function removeCallback() {
      if (!(cb as any).__onceListener__) {
        self.off(type, cb)
      }
    }
  }

  once(type: string, cb: Function) {
    if (__DEV__) {
      if (!isString(type)) { throw new TypeError('Parameter 1 is not a string') }
      if (!isFunction(cb)) { throw new TypeError('Parameter 2 is not a function') }
    }
    const handler = function handler(...args: []) {
      cb.call(cb, ...args)
      this.off(type, handler)
    }
    handler.__onceListener__ = cb
    this.on(type, handler)
  }

  emit(type: string, ...args: []) {
    if (__DEV__ && !isString(type)) { throw new TypeError('Parameter 1 is not a string') }
    if (this._listeners[type] && this._listeners[type].length) {
      this._listeners[type].forEach(listener => {
        listener.call(this, ...args)
      })
    }
    return this
  }

  off(type: string, cb: Function) {
    if (__DEV__) {
      if (!isString(type)) { throw new TypeError('Parameter 1 is not a string') }
      if (!isFunction(cb)) { throw new TypeError('Parameter 2 is not a function') }
    }
    if (this._listeners[type] && this._listeners[type].length) {
      this._listeners[type] = this._listeners[type].filter(item => {
        return item !== cb && (item as any).__onceListener__ !== cb
      })
    }
    return this
  }

  offAll(type: string) {
    if (!type) {
      this._listeners = Object.create(null)
      return this;
    }
    if (__DEV__ && !isString(type)) { throw new TypeError('Parameter 1 is not a string') }
    this._listeners[type] && delete this._listeners[type];
    if (objectEmptyCheck(this._listeners)) {
      this._listeners = Object.create(null)
    }
    return this
  }

  has(type: string) {
    if (__DEV__ && !isString(type)) {
      throw new TypeError('Parameter 1 is not a string')
    }
    return this._listeners[type] && this._listeners[type].length > 0
  }

}

export default EventBus