import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: "./src/index.ts",
    output: [{
        file: "./dist/minimap-control.esm.js",
        format: "esm",
    }, {
        format: "umd",
        file: "./dist/minimap-control.umd.js",
        name: "minimap-control",
        globals: {
            'maplibregl': 'maplibregl'
        }
    },
    {
        file: "./dist/minimap-control.cjs.js",
        format: "cjs"
    }
    ],
    external: ['maplibregl'],
    plugins: [commonjs(), typescript({ tsconfig: './tsconfig.json' }), terser()]
}