import { observe } from "./obeserver";
import { proxyData } from "./state.js";
import { compileToRenderFunction } from "./compiler";
import { mountComponent } from './lifecycle';

export function initMixin(Vue) {
    Vue.prototype._init = init;
    Vue.prototype.$mount = $mount;
}

function init(options) {
    const vm = this;
    vm.$options = options;

    initState(vm);

    if (vm.$options.el) {
        vm.$mount(vm.$options.el);
    }
}

function $mount(el) {
    const vm = this,
        options = vm.$options;

    el = typeof el === 'string' ? document.querySelector(el) : el;
    vm.$el = el;

    if (!options.render) {
        let template = options.template;

        if (!template && el) {
            template = el.outerHTML;
        }

        const render = compileToRenderFunction(template);
        options.render = render;
    }

    mountComponent(vm);
}

export function initState(vm) {
    const options = vm.$options;

    if (options.data) {
        initData(vm);
    }
}

function initData(vm) {
    let data = vm.$options.data;
    vm.$data = data = typeof data === 'function' ? data.call(vm) : data || {};

    for (let key in data) {
        proxyData(vm, '$data', key);
    }

    observe(data);
}