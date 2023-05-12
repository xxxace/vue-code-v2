import { ARR_METHODS } from "./config";
import observeArr from "./observeArr";

var originArrMethods = Array.prototype,
    arrMethods = Object.create(originArrMethods);

ARR_METHODS.map((key) => {
    arrMethods[key] = function () {
        var args = Array.prototype.slice.call(arguments),
            res = originArrMethods[key].apply(this, args);

        console.log('new ' + key, args)
        var newArr;

        switch (key) {
            case 'push':
            case 'unshift':
                newArr = args;
                break
            case 'splice':
                newArr = args.slice(2);
                break
            default:
                break
        }

        newArr && observeArr(newArr);

        return res;
    }
});

export {
    arrMethods
}