import { parseHTML } from './html-parser';

export function compileToRenderFunction(html) {
    const ast = parseHTML(html);
    console.log(html);
}