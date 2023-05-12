import Observer from "./observer";

export function observe(target) {
    if (typeof target !== 'object' || target === null) return;

    return new Observer(target);
}