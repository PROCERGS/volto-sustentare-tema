// Local ESLint settings for the addon package.
// Simplificação: tratamos 'volto-site-componentes' sempre como core module de lint.
// Isso evita falhas de import/no-unresolved quando o pacote não está presente no workspace (ex: CI minimal).
const path = require('path');

module.exports = {
  settings: {
    'import/core-modules': ['volto-site-componentes'],
    'import/resolver': {
      node: {
        paths: [path.join(__dirname, '..'), path.join(__dirname, '..', '..')],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    // Segurança adicional caso o plugin import não trate core-modules como resolvidos em algum ambiente
    'import/no-unresolved': [
      'error',
      { ignore: ['^volto-site-componentes$'] },
    ],
  },
};
