const path = require('path');
const resolveFromHere = (mod) => require.resolve(mod, { paths: [__dirname] });

module.exports = {
  stories: ['../src/stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-webpack5',
  },
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config) => {
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
        { loader: resolveFromHere('style-loader') },
        { loader: resolveFromHere('css-loader') },
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

    // Add asset handling for images referenced from SCSS
    config.module.rules.unshift({
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name][ext]'
      }
    });

  // Allow imports like '../../customizations/...' from theme SCSS to resolve
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  config.resolve.alias['@sustentare-customizations'] = path.resolve(__dirname, '..', 'src', 'customizations');

    return config;
  },
};
