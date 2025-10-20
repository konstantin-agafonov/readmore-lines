import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/readmore.js',
  output: {
    name: 'ReadMore',
    format: 'umd',
    file: 'dist/readmore.js',
    sourcemap: !isProduction,
    banner: `/*!
 * ReadMore.js v1.0.0
 * A lightweight JavaScript library for creating 'read more/read less' functionality
 * (c) 2025 Konstantin Agafonov
 * Released under the MIT License
 */`
  },
  plugins: [
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: ['> 1%', 'last 2 versions', 'not dead']
          }
        }]
      ]
    }),
    isProduction && terser({
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      mangle: {
        reserved: ['ReadMore']
      }
    })
  ].filter(Boolean)
};
