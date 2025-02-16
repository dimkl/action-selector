import type { Options } from 'tsup'

const config: Options = {
  entry: ['src/index.ts'],
  // splitting: false,
  // minify: true,
  // target: "es2016",
  sourcemap: true,
  format: ["esm", "iife"],
  legacyOutput: true,
  bundle: true,
  clean: true,
  dts: true,
};

export default config;
