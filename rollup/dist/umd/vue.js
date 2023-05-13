(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function generate(el) {
    var children = getChildren(el);
    var code = "_c('".concat(el.tag, "', ").concat(el.attrs.length > 0 ? "".concat(formatProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : 'undefined', ")");
    return code;
  }
  function getChildren(el) {
    var children = el.children;
    if (children) {
      return children.map(function (c) {
        return generateChild(c);
      }).join(',');
    }
  }
  function generateChild(node) {
    if (node.type === 1) {
      return generate(node);
    } else if (node.type === 3) {
      var text = node.text;
      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      }
      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0;
      var textArr = [];
      while (match = defaultTagRE.exec(text)) {
        index = match.index;
        if (index > lastIndex) {
          textArr.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        textArr.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        textArr.push(text.slice(lastIndex));
      }
      return "_v(".concat(textArr.join('+'), ")");
    }
  }
  function formatProps(attrs) {
    var str = '';
    var _loop = function _loop() {
      var attr = attrs[i];
      if (attr.name === 'style') {
        var styleAttrs = {};
        attr.value.split(';').map(function (styleAttr) {
          if (!styleAttr) return;
          var _styleAttr$split = styleAttr.split(':'),
            _styleAttr$split2 = _slicedToArray(_styleAttr$split, 2),
            key = _styleAttr$split2[0],
            value = _styleAttr$split2[1];
          styleAttrs[key] = value;
        });
        attr.value = styleAttrs;
      }
      str += "".concat(attr.name, ": ").concat(JSON.stringify(attr.value), ",");
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    return "{".concat(str.slice(0, -1), "}");
  }

  // Regular Expressions for parsing tags and attributes
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

  // id="app" id='app' id=app
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

  // 标签名 <my-tag></my-tag>
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z".concat(unicodeRegExp.source, "]*");
  // <my:tag></my:tag>
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  // <div
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  // />
  var startTagClose = /^\s*(\/?)>/;
  // </div>
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  function parseHTML(html) {
    var text, root, currentParent;
    var stack = [];
    while (html) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }
      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }
      if (text) {
        advance(text.length);
        chars(text);
      }
    }
    function parseStartTag() {
      var start = html.match(startTagOpen);
      var end, attr;
      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }
        if (end) {
          advance(end[0].length);
          return match;
        }
      }
    }
    function advance(n) {
      html = html.substring(n);
    }
    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);
      if (!root) {
        root = element;
      }
      currentParent = element;
      stack.push(element);
    }
    function end(tagName) {
      var element = stack.pop();
      currentParent = stack[stack.length - 1];
      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }
    function chars(text) {
      text = text.trim();
      if (text.length) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }
    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        attrs: attrs,
        parent: parent
      };
    }
    return root;
  }

  function compileToRenderFunction(html) {
    var ast = parseHTML(html);
    var code = generate(ast);
    var render = new Function("\n        with(this) { \n            return ".concat(code, " \n        };\n    "));
    console.log(html);
    console.log(ast);
    console.log(code);
    console.log(render);
    return render;
  }

  function patch(oldNode, vnode) {
    var newNode = createElement$1(vnode);
    var parentElement = oldNode.parentNode;
    parentElement.insertBefore(newNode, oldNode.nextSibling);
    parentElement.removeChild(oldNode);
  }
  function createElement$1(vnode) {
    var tag = vnode.tag;
      vnode.attrs;
      var children = vnode.children,
      text = vnode.text;
    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      updateProps(vnode);
      children.map(function (child) {
        vnode.el.appendChild(createElement$1(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }
  function updateProps(vnode) {
    var el = vnode.el,
      newProps = vnode.props || {};
    for (var key in newProps) {
      if (key === 'style') {
        for (var sKey in newProps.style) {
          el.style[sKey] = newProps.style[sKey];
        }
      } else if (key === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  function mountComponent(vm) {
    vm._update(vm._render());
  }
  function lifecycleMixin(Vue) {
    Vue.prototype._update = $update;
  }
  function $update(vnode) {
    var vm = this;
    patch(vm.$el, vnode);
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
    mountComponent(vm);
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

  function createElement(tag) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    return vnode(tag, attrs, children);
  }
  function createTextVNode(tetx) {
    return vnode(undefined, undefined, undefined, tetx);
  }
  function vnode(tag, props, children, text) {
    return {
      tag: tag,
      props: props,
      children: children,
      text: text
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = _c;
    Vue.prototype._v = _v;
    Vue.prototype._s = _s;
    Vue.prototype._render = $render;
  }
  function _c() {
    return createElement.apply(void 0, arguments);
  }
  function _v(text) {
    return createTextVNode(text);
  }
  function _s(value) {
    if (value === null) return;
    return _typeof(value) === 'object' ? JSON.stringify(value) : value;
  }
  function $render() {
    var vm = this,
      render = vm.$options.render,
      vnode = render.call(vm);
    return vnode;
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
