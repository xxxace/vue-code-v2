import { isArray } from "./utils";
import { defineReactiveData } from './reactive';
import { arrMethods } from "./array";
import observeArr from "./observeArr";

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
}

export default Observer;