import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
// import html from "@rollup/plugin-html";
import nodeResolve from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";

export default {
    input: './src/index.js',
    output: {
        name: 'Vue',
        file: 'dist/umd/vue.js',
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        commonjs(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**'
        }),
        // html(),
        nodeResolve({
            extensions: ['.js']
        }),
        serve({
            open: false,
            port: 8080,
            contentBase: '',
            openPage: './index.html'
        })
    ]
}