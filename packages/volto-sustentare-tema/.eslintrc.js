// Local ESLint settings for the addon package.
// Reintroduz detecção condicional de 'volto-site-componentes' para evitar erro quando ausente.
const path = require('path');
let hasVoltoSiteComponentes = false;
try {
  require.resolve('volto-site-componentes/package.json', { paths: [__dirname] });
  hasVoltoSiteComponentes = true;
} catch (_) {
  // pacote não presente; não vamos declarar como core-module
}

module.exports = {
  settings: {
    // declarar como core-module apenas se resolvível
    ...(hasVoltoSiteComponentes
      ? { 'import/core-modules': ['volto-site-componentes'] }
      : {}),
    'import/resolver': {
      node: {
        // Allow eslint-plugin-import to search these roots when resolving bare specifiers
        paths: [path.join(__dirname, '..'), path.join(__dirname, '..', '..')],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
