import { observe } from "../obeserver";

export function defineReactiveData(data, key, value) {
    observe(value);
    Object.defineProperty(data, key, {
        get() {
            console.log('get', key)
            return value;
        },
        set(newValue) {
            console.log('set', key)
            if (newValue === value) return;
            observe(newValue);
            value = newValue;
        }
    })
}