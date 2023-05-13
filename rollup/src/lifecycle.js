import { patch } from "./vdom/patch";

export function mountComponent(vm) {
    vm._update(vm._render());
}

export function lifecycleMixin(Vue) {
    Vue.prototype._update = $update;
}

function $update(vnode) {
    const vm = this;

    patch(vm.$el, vnode);
}