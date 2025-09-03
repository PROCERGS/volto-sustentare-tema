module.exports = {
  stories: ['../src/stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-webpack5',
  },
  webpackFinal: async (config) => {
    const path = require('path');
    const resolveFromHere = (mod) => require.resolve(mod, { paths: [__dirname] });

    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Ensure addon source (JSX) is transpiled
    config.module.rules.unshift({
      test: /\.(js|jsx)$/,
      include: [path.resolve(__dirname, '..', 'src')],
      exclude: /node_modules/,
      use: {
        loader: resolveFromHere('babel-loader'),
        options: {
          presets: [resolveFromHere('@babel/preset-env'), resolveFromHere('@babel/preset-react')],
        },
      },
    });

    // Add SCSS handling so the theme can be imported in preview
    config.module.rules.unshift({
      test: /\.scss$/,
      use: [
        // these loaders will be resolved from the addon's node_modules
        resolveFromHere('style-loader'),
        resolveFromHere('css-loader'),
        {
          loader: resolveFromHere('sass-loader'),
          options: {
            // prefer dart-sass (the 'sass' package)
            implementation: require(resolveFromHere('sass')),
          },
        },
      ],
      include: [path.resolve(__dirname, '..', 'src')],
    });

  // Allow imports like '../../customizations/...' from theme SCSS to resolve
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  config.resolve.alias['@sustentare-customizations'] = path.resolve(__dirname, '..', 'src', 'customizations');

  // Add a rule so url('../../customizations/...') is resolvable by replacing that prefix
  // via the sass-loader's additionalData could also be used, but alias is simpler.

    return config;
  },
};
