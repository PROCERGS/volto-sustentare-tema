function hasVoltoSiteComponentes() {
  try {
    require.resolve('volto-site-componentes/package.json', { paths: [__dirname] });
    return true;
  } catch (_) {
    return false;
  }
}

const addons = ['@kitconcept/volto-light-theme', 'volto-sustentare-tema'].concat(
  hasVoltoSiteComponentes() ? ['volto-site-componentes'] : [],
);

const theme = '@kitconcept/volto-light-theme';

module.exports = { addons, theme };
