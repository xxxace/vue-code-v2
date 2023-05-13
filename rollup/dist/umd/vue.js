(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  var toString = Object.prototype.toString;
  function getType(val) {
    return toString.call(val).slice(8, -1).toLowerCase();
  }
  function isArray(val) {
    return getType(val) === 'array';
  }

  function defineReactiveData(data, key, value) {
    observe(value);
    Object.defineProperty(data, key, {
      get: function get() {
        console.log('get', key);
        return value;
      },
      set: function set(newValue) {
        console.log('set', key);
        if (newValue === value) return;
        observe(newValue);
        value = newValue;
      }
    });
  }

  var ARR_METHODS = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'];

  function observeArr(arr) {
    for (var i = 0; i < arr.length; i++) {
      observe(arr[i]);
    }
  }
  var originArrMethods = Array.prototype,
    arrMethods = Object.create(originArrMethods);
  ARR_METHODS.map(function (key) {
    arrMethods[key] = function () {
      var args = Array.prototype.slice.call(arguments),
        res = originArrMethods[key].apply(this, args);
      console.log('new ' + key, args);
      var newArr;
      switch (key) {
        case 'push':
        case 'unshift':
          newArr = args;
          break;
        case 'splice':
          newArr = args.slice(2);
          break;
      }
      newArr && observeArr(newArr);
      return res;
    };
  });

  function Observer(target) {
    if (isArray(target)) {
      target.__proto__ = arrMethods;
      observeArr(target);
    } else {
      this.walk(target);
    }
  }
  Observer.prototype.walk = function (target) {
    var keys = Object.keys(target);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i],
        value = target[key];
      defineReactiveData(target, key, value);
    }
  };
  function observe(target) {
    if (_typeof(target) !== 'object' || target === null) return;
    return new Observer(target);
  }

  function proxyData(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }

  function compileToRenderFunction(html) {
    console.log(html);
  }

  function initMixin(Vue) {
    Vue.prototype._init = init;
    Vue.prototype.$mount = $mount;
  }
  function init(options) {
    var vm = this;
    vm.$options = options;
    initState(vm);
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }
  function $mount(el) {
    var vm = this,
      options = vm.$options;
    el = typeof el === 'string' ? document.querySelector(el) : el;
    vm.$el = el;
    if (!options.render) {
      var template = options.template;
      if (!template && el) {
        template = el.outerHTML;
      }
      var render = compileToRenderFunction(template);
      options.render = render;
    }
  }
  function initState(vm) {
    var options = vm.$options;
    if (options.data) {
      initData(vm);
    }
  }
  function initData(vm) {
    var data = vm.$options.data;
    vm.$data = data = typeof data === 'function' ? data.call(vm) : data || {};
    for (var key in data) {
      proxyData(vm, '$data', key);
    }
    observe(data);
  }

  console.log('hello rollup');
  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
