const path = require('path');

const projectRootPath = path.resolve(__dirname, '..', '..', '..');
const resolveFromHere = (mod) => require.resolve(mod, { paths: [__dirname] });

module.exports = {
  stories: ['../packages/volto-sustentare-tema/src/stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [],
  previewAnnotations: () => [],
  framework: {
    name: '@storybook/react-webpack5',
  },
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.extensions = Array.from(new Set([
      ...(config.resolve.extensions || []),
      '.js',
      '.jsx',
    ]));
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'volto-site-componentes': path.join(
        projectRootPath,
        'packages',
        'volto-site-componentes',
        'packages',
        'volto-site-componentes',
        'src',
      ),
    };
    // Transpile JSX files in this addon and the root preview
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    // Put our babel rule first to ensure JSX is handled before other oneOf rules
    config.module.rules.unshift({
      test: /\.(js|jsx)$/,
      include: [
        // The addon package sources
        path.resolve(__dirname, '..'),
        // The frontend root, to cover root .storybook/preview.jsx
        path.resolve(__dirname, '../../..'),
      ],
      exclude: /node_modules/,
      use: {
    loader: resolveFromHere('babel-loader'),
        options: {
          presets: [
      resolveFromHere('@babel/preset-env'),
      resolveFromHere('@babel/preset-react'),
          ],
        },
      },
    });

    return config;
  },
};
