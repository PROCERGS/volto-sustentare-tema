function hasVoltoSiteComponentes() {
  try {
    require.resolve('volto-site-componentes/package.json', { paths: [__dirname] });
    return true;
  } catch (_) {
    return false;
  }
}

function hasVoltoGoogleAnalytics() {
  try {
    require.resolve('volto-google-analytics/package.json', { paths: [__dirname] });
    return true;
  } catch (_) {
    return false;
  }
}

const addons = ['@kitconcept/volto-light-theme', 'volto-sustentare-tema', 'volto-google-analytics']
  .concat(hasVoltoSiteComponentes() ? ['volto-site-componentes'] : [])
  .concat(hasVoltoGoogleAnalytics() ? ['volto-google-analytics'] : []);

const theme = '@kitconcept/volto-light-theme';

module.exports = { addons, theme };
