import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const CODES = [
  'THIS_IS_UNDEFINED',
  'MISSING_GLOBAL_NAME',
  'CIRCULAR_DEPENDENCY',
];

const discardWarning = warning => {
  if (CODES.includes(warning.code)) {
    return;
  }

  console.error(warning);
};

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
    onwarn: discardWarning,
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
    onwarn: discardWarning,
    input: './index.js', 
    output: [
      { dir: '../dist', format: 'esm', sourcemap: true },
      // { dir: 'cjs', format: 'cjs', exports: 'named', sourcemap: true },
    ],
    plugins: commonPlugins(),
  },
];