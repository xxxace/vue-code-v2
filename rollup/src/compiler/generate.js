const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function generate(el) {
    let children = getChildren(el);

    let code = `_c('${el.tag}', ${
        el.attrs.length > 0 ? `${formatProps(el.attrs)}` : 'undefined'
    }${
        children ? `,${children}` : 'undefined'
    })`

    return code;
}

function getChildren(el) {
    const children = el.children;

    if (children) {
        return children.map(c => generateChild(c)).join(',');
    }
}

function generateChild(node) {
    if (node.type === 1) {
        return generate(node);
    } else if (node.type === 3) {
        let text = node.text;

        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }

        let match, index;
        let lastIndex = defaultTagRE.lastIndex = 0;
        let textArr = [];

        while (match = defaultTagRE.exec(text)) {
            index = match.index;
            if (index > lastIndex) {
                textArr.push(JSON.stringify(text.slice(lastIndex, index)));
            }

            textArr.push(`_s(${match[1].trim()})`);
            lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
            textArr.push(text.slice(lastIndex));
        }

        return `_v(${textArr.join('+')})`;
    }
}

function formatProps(attrs) {
    let str = '';

    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];

        if (attr.name === 'style') {
            const styleAttrs = {};
            attr.value.split(';').map((styleAttr) => {
                if (!styleAttr) return;
                const [key, value] = styleAttr.split(':');
                styleAttrs[key] = value;
            })
            attr.value = styleAttrs;
        }

        str += `${attr.name}: ${JSON.stringify(attr.value)},`;
    }

    return `{${str.slice(0, -1)}}`;
}