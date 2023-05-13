const toString = Object.prototype.toString;

function getType(val) {
    return toString.call(val).slice(8, -1).toLowerCase();
}

export function isArray(val) {
    return getType(val) === 'array';
}