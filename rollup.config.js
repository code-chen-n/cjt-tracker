// import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
import ts from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import path from 'node:path';
import { fileURLToPath } from 'url';

// 使用 Import.meta.url 提取当前模块的 url
// 然后使用 url 模块中的 fileURLToPath 函数将其转化为文件路径
// 最后使用 path 模块中的 dirname 函数提取目录名称
const __filename = fileURLToPath(import.meta.url);   
const __dirname = path.dirname(__filename);


export default [
    {
        input: "./src/core/index.ts",
        output: [
            {
                file:path.resolve(__dirname, './dist/index.esm.js'),
                format: 'es',
            },
            {
                file:path.resolve(__dirname, './dist/index.cjs.js'),
                format: 'cjs',
            },
            {
                file:path.resolve(__dirname, './dist/index.js'),
                format: 'umd',
                name: 'tracker'
            }
        ],
        plugins: [
            ts()
        ]
    },
    {
        input: './src/core/index.ts',
        output: {
            file: path.resolve(__dirname, './dist/d.ts'),
            format: 'es'
        },
        plugins:[
            dts()
        ]
    }
]