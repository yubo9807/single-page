(() => {
  // vue/utils/judge.ts
  function isType(o) {
    return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
  }
  function isObject(o) {
    return ["object", "array"].includes(isType(o));
  }
  function hasOwn(target, key) {
    return Object.prototype.hasOwnProperty.call(target, key);
  }
  function isEquals(val1, val2) {
    if (typeof val1 === "object" && typeof val2 === "object") {
      const keys1 = Object.keys(val1), keys2 = Object.keys(val2);
      if (keys1.length !== keys2.length)
        return false;
      for (const key of keys1) {
        if (!keys2.includes(key))
          return false;
        const bool = isEquals(val1[key], val2[key]);
        if (!bool)
          return false;
      }
      return true;
    } else {
      return val1 === val2;
    }
  }

  // vue/utils/next-tick.ts
  function nextTick(func2) {
    if (typeof Promise !== void 0) {
      Promise.resolve().then(func2);
    } else if (typeof MutationObserver !== void 0) {
      const ob = new MutationObserver(func2);
      const textNode = document.createTextNode("0");
      ob.observe(textNode, { characterData: true });
      textNode.data = "1";
    } else if (typeof process !== void 0) {
      process.nextTick(func2);
    } else {
      setTimeout(func2, 0);
    }
  }

  // vue/reactivity/depend.ts
  var func = null;
  var funcsMap = /* @__PURE__ */ new WeakMap();
  function binding(fn) {
    func = fn;
    fn();
    func = null;
  }
  function dependencyCollection(key) {
    const funcs = funcsMap.get(key) || [];
    const bool = funcs.some((fn) => func === fn);
    if (func && !bool) {
      funcs.push(func);
      funcsMap.set(key, funcs);
    }
  }
  function distributeUpdates(key) {
    const funcs = funcsMap.get(key);
    funcs && funcs.forEach((fn, index) => {
      const del = fn();
      if (typeof del === "boolean" && del) {
        funcs.splice(index, 1);
        funcsMap.set(key, funcs);
      }
    });
  }

  // vue/reactivity/readonly.ts
  function readonly(target) {
    Reflect.defineProperty(target, ReactiveFlags.IS_READONLY, {
      value: true
    });
    return new Proxy(target, {
      get(target2, key) {
        if (key === ReactiveFlags.RAW)
          return target2;
        return Reflect.get(target2, key);
      },
      set(target2, key, value) {
        const oldValue = Reflect.get(target2, key);
        console.warn(`Set operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
        return oldValue;
      },
      deleteProperty(target2, key) {
        const oldValue = Reflect.get(target2, key);
        console.warn(`Delete operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
        return oldValue;
      }
    });
  }
  function isReadonly(proxy) {
    return proxy && readonly(proxy)[ReactiveFlags.IS_READONLY];
  }

  // vue/reactivity/reactive.ts
  var rawMap = /* @__PURE__ */ new WeakMap();
  var ReactiveFlags = {
    RAW: Symbol("__v_raw"),
    IS_READONLY: Symbol("__v_isReadonly")
  };
  function reactive(target) {
    if (!isObject(target) || rawMap.get(target))
      return target;
    let backupKey = null;
    return new Proxy(target, {
      // 获取
      get(target2, key, receiver) {
        if (key === ReactiveFlags.RAW)
          return target2;
        dependencyCollection(target2);
        const result = Reflect.get(target2, key, receiver);
        return isObject(result) ? reactive(result) : result;
      },
      // 赋值/修改
      set(target2, key, value, receiver) {
        const oldValue = Reflect.get(target2, key, receiver);
        const result = Reflect.set(target2, key, value, receiver);
        if (target2[ReactiveFlags.IS_READONLY]) {
          return oldValue;
        }
        nextTick(() => {
          const newValue = Reflect.get(target2, key, receiver);
          if (result && oldValue !== value && newValue === value) {
            distributeUpdates(target2);
          }
        });
        return result;
      },
      // 删除
      deleteProperty(target2, key) {
        const oldValue = Reflect.get(target2, key);
        const hasKey = hasOwn(target2, key);
        const result = Reflect.deleteProperty(target2, key);
        backupKey = key;
        nextTick(() => {
          if (hasKey && result && oldValue !== void 0, key === backupKey) {
            distributeUpdates(target2);
            backupKey = null;
          }
        });
        return result;
      }
    });
  }
  function isReactive(reactive2) {
    return !!reactive2[ReactiveFlags.RAW];
  }
  function toRaw(reactive2) {
    return isReactive(reactive2) ? reactive2[ReactiveFlags.RAW] : reactive2;
  }
  function isProxy(proxy) {
    return isReactive(proxy) || isReadonly(proxy);
  }
  function markRaw(obj) {
    if (isObject(obj))
      rawMap.set(obj, true);
    return obj;
  }

  // vue/reactivity/ref.ts
  var ISREF = "__v_isRef";
  var RefImpl = class {
    [ISREF] = true;
    __v_isShallow = false;
    _rawValue;
    _value;
    constructor(value) {
      this._rawValue = value;
      this._value = isObject(value) ? reactive(value) : reactive({ value });
    }
    get value() {
      return isObject(this._rawValue) ? this._value : this._value.value;
    }
    set value(newValue) {
      if (isObject(newValue)) {
        const keys = Object.keys(newValue);
        for (const prop in keys) {
          this._value[prop] = newValue[prop];
        }
        for (const prop in Object.keys(this._rawValue)) {
          !keys.includes(prop) && delete this._value[prop];
        }
      } else {
        this._value.value = newValue;
      }
      this._rawValue = newValue;
    }
  };
  function ref(value) {
    return new RefImpl(value);
  }
  function isRef(ref3) {
    return ref3 && !!ref3[ISREF];
  }
  function unref(ref3) {
    return isRef(ref3) ? ref3.value : ref3;
  }
  var ObjectRefImpl = class {
    __v_isRef = true;
    _defaultValue;
    _key;
    _object;
    constructor(target, key, defaultValue = void 0) {
      this._defaultValue = defaultValue;
      this._key = key;
      this._object = target;
    }
    get value() {
      return this._object[this._key];
    }
    set value(value) {
      this._object[this._key] = value;
    }
  };
  function toRef(target, key, defaultValue = void 0) {
    return new ObjectRefImpl(target, key, defaultValue);
  }
  function toRefs(target) {
    const obj = {};
    for (const key in target) {
      obj[key] = new ObjectRefImpl(target, key);
    }
    return obj;
  }
  var CustomRefImpl = class extends RefImpl {
    _get;
    _set;
    constructor(callback) {
      let isRef2 = false;
      const { get, set } = callback(
        () => isRef2 = true,
        () => this.setValue()
      );
      super(get());
      this.__v_isRef = isRef2;
      this._get = get;
      this._set = set;
    }
    get value() {
      return this.__v_isRef ? super.value : this._get();
    }
    // 方法重写，阻断，将 val 指给 set 函数
    set value(val) {
      this._set(val);
    }
    /**
     * 设置 value，在合适的时间调用
     */
    setValue() {
      super.value = this._get();
    }
  };
  function customRef(callback) {
    return new CustomRefImpl(callback);
  }

  // vue/reactivity/signal.ts
  function createSignal(value) {
    const o = reactive({
      value
    });
    function getSignal() {
      return o.value;
    }
    function setSignal(newValue) {
      o.value = newValue;
    }
    return [
      getSignal,
      setSignal
    ];
  }

  // vue/reactivity/effect.ts
  var ReactiveEffect = class {
    fn;
    constructor(fn) {
      this.fn = fn;
    }
  };

  // vue/reactivity/computed.ts
  var ComputedRefImpl = class {
    __v_isReadonly = true;
    [ISREF] = true;
    _cacheable = true;
    _dirty = true;
    computed;
    _setter;
    constructor(getter, setter) {
      this.computed = new ReactiveEffect(getter);
      this._setter = setter;
    }
    get value() {
      return this.computed.fn();
    }
    set value(val) {
      this._setter ? this._setter(val) : console.warn(`Write operation failed: computed value is readonly`);
    }
  };
  function computed(option) {
    if (typeof option === "function") {
      return new ComputedRefImpl(option);
    }
    return new ComputedRefImpl(option.get, option.set);
  }

  // vue/utils/object.ts
  function clone(obj) {
    if (obj instanceof Array)
      return cloneArray(obj);
    else if (isType(obj) === "object")
      return cloneObject(obj);
    else
      return obj;
  }
  function cloneObject(obj) {
    let result = {};
    let names = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < names.length; i++) {
      result[names[i]] = clone(obj[names[i]]);
    }
    return result;
  }
  function cloneArray(obj) {
    let result = new Array(obj.length);
    for (let i = 0; i < result.length; i++) {
      result[i] = clone(obj[i]);
    }
    return result;
  }

  // vue/reactivity/watch.ts
  function watch(source, cb, option = {}) {
    let cleanup = false;
    if (cleanup)
      return;
    const oldValue = source();
    let backup = clone(oldValue);
    option.immediate && cb(oldValue, void 0);
    binding(() => {
      if (cleanup)
        return true;
      const value = source();
      const bool = option.deep ? isEquals(value, backup) : value === backup;
      if (!bool) {
        cb(value, reactive(backup));
        backup = clone(value);
      }
    });
    return () => {
      cleanup = true;
    };
  }
  function watchEffect(cb) {
    let cleanup = false;
    let lock = false;
    binding(() => {
      if (cleanup)
        return true;
      cb((cleanupFn) => {
        lock && cleanupFn();
        lock = true;
      });
    });
    return () => {
      cleanup = true;
    };
  }

  // vue/router/init-router.ts
  var base = "";
  var mode = "history";
  var isBrowser = true;
  function initRouter(option) {
    base = option.base;
    mode = option.mode;
    isBrowser = option.isBrowser;
  }

  // vue/router/utils.ts
  function splicingUrl(option) {
    const pathname = option.path;
    let queryStr = "";
    for (const key in option.query) {
      queryStr += `&${key}=${option.query[key]}`;
    }
    queryStr = queryStr ? "?" + queryStr : "";
    const hash = option.hash ? "#" + option.hash : "";
    const url = pathname + queryStr + hash;
    return url;
  }
  function getQueryAll(search) {
    const obj = {};
    const arr = search.replace("?", "").split("&");
    arr.forEach((val) => {
      const [key, value] = val.split("=");
      if (key && value)
        obj[key] = value;
    });
    return obj;
  }
  function formatPath(url) {
    return url.replace(/\/+/g, "/");
  }

  // vue/router/use-route.ts
  var currentRoute = reactive({
    path: "",
    query: {},
    hash: "",
    meta: {}
  });
  function analysisRoute(url) {
    const newUrl = new URL("http://0.0.0.0" + url);
    currentRoute.path = newUrl.pathname.replace(base, "");
    currentRoute.query = getQueryAll(newUrl.search);
    currentRoute.hash = newUrl.hash;
  }
  function useRoute() {
    return currentRoute;
  }

  // vue/router/use-router.ts
  function push(option) {
    const path = typeof option === "string" ? option : splicingUrl(option);
    if (mode === "history") {
      history.pushState({}, "", formatPath(base + "/" + path));
    } else {
      location.hash = path;
    }
    analysisRoute(path);
  }
  function replace(option) {
    const path = typeof option === "string" ? option : splicingUrl(option);
    if (mode === "history") {
      history.replaceState({}, "", formatPath(base + "/" + path));
    } else {
      location.hash = path;
    }
    analysisRoute(path);
  }
  function go(num) {
    history.go(num);
  }
  function useRouter() {
    return {
      push,
      replace,
      go
    };
  }

  // vue/main.ts
  window.vue = {
    isReactive,
    markRaw,
    reactive,
    toRaw,
    isProxy,
    customRef,
    isRef,
    ref,
    toRef,
    toRefs,
    unref,
    createSignal,
    readonly,
    computed,
    watch,
    watchEffect,
    autoRun: binding,
    nextTick,
    createRouter: initRouter,
    useRoute,
    useRouter
  };
})();
