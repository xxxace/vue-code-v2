import { generate } from './generate';
import { parseHTML } from './html-parser';

export function compileToRenderFunction(html) {
    const ast = parseHTML(html);
    const code = generate(ast);
    const render = new Function(`
        with(this) { 
            return ${code} 
        };
    `)

    console.log(html);
    console.log(ast);
    console.log(code);
    console.log(render);

    return render;
}