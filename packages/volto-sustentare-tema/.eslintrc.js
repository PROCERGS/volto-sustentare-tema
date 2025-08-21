// Local ESLint settings for the addon package: ensure eslint-plugin-import resolves
// workspace packages like 'volto-site-componentes' by name during Code Analysis.
// No runtime impact; acceptance unaffected.

const path = require('path');

module.exports = {
  settings: {
    'import/resolver': {
      node: {
        // Allow eslint-plugin-import to search these roots when resolving bare specifiers
        paths: [
          // sibling packages folder (contains 'volto-site-componentes')
          path.join(__dirname, '..'),
          // also consider the top-level frontend packages (in case of different layouts)
          path.join(__dirname, '..', '..'),
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
