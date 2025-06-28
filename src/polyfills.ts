// Polyfills for older Android WebView (Chrome 61)
import 'object.hasown/auto';

// Object.entries polyfill
if (!Object.entries) {
  Object.entries = function(obj: any) {
    const ownProps = Object.keys(obj);
    let i = ownProps.length;
    const resArray = new Array(i);
    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }
    return resArray;
  };
}

// Object.values polyfill
if (!Object.values) {
  Object.values = function(obj: any) {
    return Object.keys(obj).map(key => obj[key]);
  };
}

// Array.prototype.includes polyfill
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement: any, fromIndex?: number) {
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    const O = Object(this);
    const len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    const n = parseInt(String(fromIndex)) || 0;
    let k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {
        k = 0;
      }
    }
    while (k < len) {
      if (searchElement === O[k]) {
        return true;
      }
      k++;
    }
    return false;
  };
}

// String.prototype.includes polyfill
if (!String.prototype.includes) {
  String.prototype.includes = function(search: string, start?: number) {
    if (typeof start !== 'number') {
      start = 0;
    }
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

// Object.assign polyfill
if (typeof Object.assign !== 'function') {
  Object.assign = function(target: any, ...sources: any[]) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    const to = Object(target);
    for (let index = 0; index < sources.length; index++) {
      const nextSource = sources[index];
      if (nextSource != null) {
        for (const nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

// Array.from polyfill
if (!Array.from) {
  Array.from = function(arrayLike: any, mapFn?: any, thisArg?: any) {
    const C = this;
    const items = Object(arrayLike);
    if (arrayLike == null) {
      throw new TypeError('Array.from requires an array-like object - not null or undefined');
    }
    const len = Number(items.length);
    const A = typeof C === 'function' ? Object(new C(len)) : new Array(len);
    let k = 0;
    while (k < len) {
      const kValue = items[k];
      if (mapFn) {
        A[k] = thisArg ? mapFn.call(thisArg, kValue, k) : mapFn(kValue, k);
      } else {
        A[k] = kValue;
      }
      k += 1;
    }
    A.length = len;
    return A;
  };
}

// Promise.finally polyfill
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(callback: () => void) {
    const P = this.constructor as PromiseConstructor;
    return this.then(
      value => P.resolve(callback()).then(() => value),
      reason => P.resolve(callback()).then(() => { throw reason; })
    );
  };
}

// String.prototype.padStart polyfill
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength: number, padString?: string) {
    targetLength = targetLength >> 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (this.length >= targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length);
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

// String.prototype.padEnd polyfill
if (!String.prototype.padEnd) {
  String.prototype.padEnd = function padEnd(targetLength: number, padString?: string) {
    targetLength = targetLength >> 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (this.length >= targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length);
      }
      return String(this) + padString.slice(0, targetLength);
    }
  };
}

console.log('Polyfills loaded for older Android WebView support');