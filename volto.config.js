const path = require('path');
const fs = require('fs');

function hasVoltoSiteComponentes() {
  // Try Node resolution from this package context
  try {
    require.resolve('volto-site-componentes/package.json', { paths: [__dirname] });
    return true;
  } catch (e) {}
  // Try common local workspace locations
  const candidates = [
    path.join(
      __dirname,
      'packages',
      'volto-site-componentes',
      'packages',
      'volto-site-componentes',
    ),
    path.join(
      __dirname,
      '..',
      'volto-site-componentes',
      'packages',
      'volto-site-componentes',
    ),
  ];
  return candidates.some((p) => fs.existsSync(p));
}

const addons = ['@kitconcept/volto-light-theme', 'volto-sustentare-tema'];
if (hasVoltoSiteComponentes()) {
  addons.push('volto-site-componentes');
}

const theme = '@kitconcept/volto-light-theme';

module.exports = { addons, theme };
