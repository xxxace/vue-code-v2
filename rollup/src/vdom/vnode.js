export function createElement(tag, attrs = {}, ...children) {
    return vnode(tag, attrs, children);
}

export function createTextVNode(tetx) {
    return vnode(undefined, undefined, undefined, tetx);
}

function vnode(tag, props, children, text) {
    return {
        tag,
        props,
        children,
        text
    }
}