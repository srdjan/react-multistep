import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const env = process.env.NODE_ENV;

const commonPlugins = () => [
  external({
    includeDependencies: true,
  }),
  babel({
    babelrc: false,
    presets: [['@babel/preset-env', { modules: false }], '@babel/preset-react'],
    extensions: EXTENSIONS,
    exclude: 'node_modules/**',
  }),
  commonjs({
    include: /node_modules/,
  }),
  replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
  resolve({
    extensions: EXTENSIONS,
    preferBuiltins: false,
  }),
];

export default [
  {
    input: './index.js',
    output: {
      esModule: false,
      format: 'umd',
      name: 'react-multistep',
      exports: 'named',
      globals: {
        'react': 'React'
      },
    },
    plugins: [...commonPlugins(), env === 'production' && terser()],
  },
  {
    input: './index.js', 
    output: [
      { dir: '../dist', format: 'esm', sourcemap: true },
      // { dir: '../dist', format: 'cjs', exports: 'named', sourcemap: true },
    ],
    plugins: commonPlugins(),
  },
];