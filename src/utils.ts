/**
 * 工具集
 */

export const isObject = function isObject(obj: any) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

export const isArray = function isArray(arr: any) {
    return Object.prototype.toString.call(arr) === '[object Array]';
};

export const isPromise = function isPromise(obj: any) {
    return !!obj
        && (typeof obj === 'object' || typeof obj === 'function')
        && typeof obj.then === 'function';
};

export const isFunction = function isFunction(fn: any) {
    return Object.prototype.toString.call(fn) === '[object Function]';
};

export const isString = function isString(str: any) {
    return Object.prototype.toString.call(str) === "[object String]";
};

export const objectEmptyCheck = function objectEmptyCheck(obj: object) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

