import { createElement, createTextVNode } from "./vnode";

export function renderMixin(Vue) {
    Vue.prototype._c = _c;
    Vue.prototype._v = _v;
    Vue.prototype._s = _s;
    Vue.prototype._render = $render;
}

function _c() {
    return createElement(...arguments);
}

function _v(text) {
    return createTextVNode(text);
}

function _s(value) {
    if (value === null) return;
    return typeof value === 'object' ? JSON.stringify(value) : value;
}

function $render() {
    const vm = this,
        render = vm.$options.render,
        vnode = render.call(vm);

    return vnode;
}