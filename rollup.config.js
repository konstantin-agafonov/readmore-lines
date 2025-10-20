import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const banner = `/*!
 * ReadMoreLines.js v1.0.0
 * A lightweight JavaScript library for creating 'read more/read less' functionality
 * (c) 2025 Konstantin Agafonov
 * Released under the MIT License
 */`;

// Base configuration
const baseConfig = {
  input: 'src/umd-entry.js',
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
    })
  ]
};

// Development build (unminified)
const devConfig = {
  ...baseConfig,
  output: {
    name: 'readmore',
    format: 'umd',
    file: 'dist/readmore.js',
    exports: 'default',
    sourcemap: true,
    banner
  }
};

// Production build (minified)
const prodConfig = {
  ...baseConfig,
  output: {
    name: 'readmore',
    format: 'umd',
    file: 'dist/readmore.min.js',
    exports: 'default',
    sourcemap: false,
    banner
  },
  plugins: [
    ...baseConfig.plugins,
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn'],
        passes: 2
      },
      mangle: {
        reserved: ['readmore']
      },
      format: {
        comments: /^!/
      }
    })
  ]
};

export default [devConfig, prodConfig];
