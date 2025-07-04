// Polyfills for Chrome 61 compatibility
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// globalThis polyfill
if (typeof globalThis === 'undefined') {
  (function() {
    if (typeof self !== 'undefined') {
      // @ts-ignore
      self.globalThis = self;
    } else if (typeof window !== 'undefined') {
      // @ts-ignore
      window.globalThis = window;
    } else if (typeof global !== 'undefined') {
      // @ts-ignore
      global.globalThis = global;
    } else {
      throw new Error('Unable to locate global object');
    }
  })();
}

// Object.hasOwn polyfill
// @ts-ignore
if (!Object.hasOwn) {
  // @ts-ignore
  Object.hasOwn = function(obj: any, prop: string | symbol) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}

// Object.assign polyfill (for older browsers)
if (!Object.assign) {
  Object.assign = function(target: any, ...sources: any[]) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    const to = Object(target);
    for (const source of sources) {
      if (source != null) {
        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            to[key] = source[key];
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
    const len = Number(items.length) || 0;
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

// Array.includes polyfill
if (!Array.prototype.includes) {
  // @ts-ignore
  Array.prototype.includes = function(searchElement: any, fromIndex?: number) {
    const O = Object(this);
    const len = parseInt(O.length) || 0;
    if (len === 0) return false;
    const n = fromIndex || 0;
    let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
    while (k < len) {
      if (searchElement === O[k]) return true;
      k++;
    }
    return false;
  };
}

// Optional chaining polyfill is handled by Babel/Vite plugin-legacy
// Nullish coalescing polyfill is handled by Babel/Vite plugin-legacy

// Object.fromEntries polyfill
if (!Object.fromEntries) {
  Object.fromEntries = function<T = any>(
    entries: Iterable<readonly [PropertyKey, T]>
  ): { [k: string]: T } {
    const obj: { [k: string]: T } = {};
    for (const [key, value] of entries) {
      obj[String(key)] = value;
    }
    return obj;
  };
}

// String.prototype.matchAll polyfill (basic implementation)
if (!String.prototype.matchAll) {
  // @ts-ignore
  String.prototype.matchAll = function(regexp: RegExp) {
    const matches = [];
    const str = this.toString();
    let match;
    
    if (!regexp.global) {
      throw new TypeError('String.prototype.matchAll called with a non-global RegExp');
    }
    
    const regex = new RegExp(regexp);
    while ((match = regex.exec(str)) !== null) {
      matches.push(match);
    }
    
    return matches[Symbol.iterator]();
  };
}

// Promise.allSettled polyfill
if (!Promise.allSettled) {
  Promise.allSettled = function(promises: any[]): Promise<PromiseSettledResult<any>[]> {
    return Promise.all(
      promises.map((p: any) =>
        Promise.resolve(p).then(
          (value: any) => ({ status: 'fulfilled' as const, value }),
          (reason: any) => ({ status: 'rejected' as const, reason })
        )
      )
    );
  } as any;
}

// Array.prototype.flat polyfill
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      // @ts-ignore
      return depth > 0 
        // @ts-ignore
        ? this.reduce((acc: any[], val: any) => 
            acc.concat(Array.isArray(val) ? val.flat(depth - 1) : val), [])
        // @ts-ignore
        : this.slice();
    }
  });
}

// Array.prototype.flatMap polyfill
if (!Array.prototype.flatMap) {
  Object.defineProperty(Array.prototype, 'flatMap', {
    value: function(callback: any, thisArg?: any) {
      // @ts-ignore
      return this.map(callback, thisArg).flat();
    }
  });
}

// Basic Proxy polyfill check (Chrome 61 has Proxy but might be incomplete)
if (typeof Proxy === 'undefined' || typeof Reflect === 'undefined') {
  console.warn('Proxy or Reflect not supported. Some React 19 features may not work correctly.');
}

// Request Animation Frame polyfill
if (!window.requestAnimationFrame) {
  // @ts-ignore
  window.requestAnimationFrame = function(callback: FrameRequestCallback) {
    return window.setTimeout(callback, 1000 / 60);
  };
}

// Cancel Animation Frame polyfill
if (!window.cancelAnimationFrame) {
  // @ts-ignore
  window.cancelAnimationFrame = function(id: number) {
    clearTimeout(id);
  };
}

// Performance.now polyfill
if (!window.performance || !window.performance.now) {
  // @ts-ignore
  window.performance = window.performance || {};
  window.performance.now = function() {
    return Date.now();
  };
}

// CustomEvent polyfill
if (typeof window.CustomEvent !== 'function') {
  // @ts-ignore
  window.CustomEvent = function(event: string, params: any) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };
}