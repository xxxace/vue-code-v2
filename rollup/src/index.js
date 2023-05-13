import { initMixin } from './init.js';
console.log('hello rollup')
function Vue(options) {
    this._init(options);
}

initMixin(Vue);

export default Vue;

