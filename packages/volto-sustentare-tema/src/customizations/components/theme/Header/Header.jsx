// SemanticUI-free pre-@plone/components
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl, defineMessages } from 'react-intl';
import config from '@plone/volto/registry';
import HeaderContainer from '../../../../components/HeaderContainer/HeaderContainer';

import icon from '../../../images/govrs.svg';
// Load 'volto-site-componentes' only if available; fall back to local shim. Use computed name to avoid
let VoltoSiteComponentes = {};
try {
  const r = typeof require === 'function' ? require : null;
  VoltoSiteComponentes = r ? r(['volto-site-componentes'].join('')) : {};
} catch (e) {
  try {
    VoltoSiteComponentes = require('../../../../shims/volto-site-componentes');
  } catch (err) {
    VoltoSiteComponentes = {};
  }
}

const messages = defineMessages({
  siteLabel: {
    id: 'siteLabel',
    defaultMessage: ' ',
  },
});

const Header = (props) => {
  const { pathname } = props;
  let siteLabel = config.settings.siteLabel;
  const token = useSelector((state) => state.userSession.token);
  const siteAction = useSelector(
    (state) => state.content.data?.['@components']?.actions?.site_actions,
  );
  const intl = useIntl();
  const translatedSiteLabel = intl.formatMessage(messages.siteLabel);
  const site = useSelector((state) => state.site.data);

  const siteTitle = site['plone.site_title'];

  siteLabel =
    siteLabel &&
    (translatedSiteLabel !== 'siteLabel' && translatedSiteLabel !== ' '
      ? translatedSiteLabel
      : siteLabel);

  return (
    <header className="header-wrapper">
      <VoltoSiteComponentes.BarraEstado />
      <VoltoSiteComponentes.BarraAcessibilidade svgImage={icon} />
      <HeaderContainer
        pathname={pathname}
        siteLabel={siteLabel}
        token={token}
        siteAction={siteAction}
        siteTitle={siteTitle}
      />
    </header>
  );
};

Header.propTypes = {
  token: PropTypes.string,
  pathname: PropTypes.string.isRequired,
};

Header.defaultProps = {
  token: null,
};

export default Header;
