import { observe } from "./observe";
import { proxyData } from "./proxy";

export function initMixin(Vue) {
    Vue.prototype._init = init;
}

function init(options) {
    var vm = this;
    vm.$options = options;

    initState(vm);
}

export function initState(vm) {
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