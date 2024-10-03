import terser from "@rollup/plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "./staging/minimap-control.js",
  output: [
    {
      file: "./dist/minimap-control.js",
      format: "esm",
      sourcemap: "inline",
    },
  ],
  plugins: [commonjs(), nodeResolve(), terser()],
};
