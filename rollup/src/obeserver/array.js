import { observe } from "./index";
import {ARR_METHODS} from '../constant';

function observeArr(arr) {
    for (let i = 0; i < arr.length; i++) {
        observe(arr[i]);
    }
}

const originArrMethods = Array.prototype,
    arrMethods = Object.create(originArrMethods);

ARR_METHODS.map((key) => {
    arrMethods[key] = function () {
        const args = Array.prototype.slice.call(arguments),
            res = originArrMethods[key].apply(this, args);

        console.log('new ' + key, args)
        let newArr;

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

export default observeArr;