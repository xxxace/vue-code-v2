import { isArray } from "../shared/utils";
import { defineReactiveData } from '../reactive';
import observeArr,{ arrMethods } from "./array.js";

function Observer(target) {
    if (isArray(target)) {
        target.__proto__ = arrMethods;
        observeArr(target);
    } else {
        this.walk(target);
    }
}

Observer.prototype.walk = function (target) {
    const keys = Object.keys(target);

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i],
            value = target[key];

        defineReactiveData(target, key, value);
    }
}

export function observe(target) {
    if (typeof target !== 'object' || target === null) return;

    return new Observer(target);
}

export default Observer;