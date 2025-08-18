const path = require('path');

const resolveFromHere = (mod) => require.resolve(mod, { paths: [__dirname] });

module.exports = {
  // Look for stories inside the inner addon package, relative to this .storybook folder
  stories: [
    path.join(__dirname, '..', 'packages', 'volto-sustentare-tema', 'src', 'stories', '**/*.stories.@(js|jsx|ts|tsx)')
  ],
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
      'volto-site-componentes': path.join(__dirname, '..', 'packages', 'volto-site-componentes', 'packages', 'volto-site-componentes', 'src'),
    };
    // Transpile JSX files in this addon and the root preview
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    // Put our babel rule first to ensure JSX is handled before other oneOf rules
  config.module.rules.unshift({
      test: /\.(js|jsx)$/,
      include: [
        // This addon package src
        path.resolve(__dirname, '..', 'packages', 'volto-sustentare-tema', 'src'),
        // Sibling package sources (aliased)
    path.resolve(__dirname, '..', 'packages', 'volto-site-componentes', 'packages', 'volto-site-componentes', 'src'),
    // Root frontend preview file, implicitly pulled by Volto's storybook starter
    path.resolve(__dirname, '../../..', '.storybook'),
  // This .storybook config (so preview.jsx is transpiled)
  path.resolve(__dirname),
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
