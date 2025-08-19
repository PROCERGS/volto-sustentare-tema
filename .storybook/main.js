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
    // Robust alias resolution: prefer sibling source, else installed package (src/dist/lib)
    const fs = require('fs');
    const siblingSrc = path.join(
      __dirname,
      '..',
      'packages',
      'volto-site-componentes',
      'packages',
      'volto-site-componentes',
      'src',
    );
    const exists = (p) => p && fs.existsSync(p);
    let aliasTarget = siblingSrc;
    if (!exists(siblingSrc)) {
      try {
        const pkgRoot = path.dirname(
          require.resolve('volto-site-componentes/package.json', { paths: [__dirname] }),
        );
        const candidates = [
          path.join(pkgRoot, 'src'),
          path.join(pkgRoot, 'dist'),
          path.join(pkgRoot, 'lib'),
          pkgRoot,
        ];
        aliasTarget = candidates.find((c) => exists(c)) || siblingSrc;
      } catch (e) {
        aliasTarget = siblingSrc;
      }
    }
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'volto-site-componentes': aliasTarget,
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
    aliasTarget,
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
