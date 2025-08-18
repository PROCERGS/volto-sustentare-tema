// SemanticUI-free pre-@plone/components
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl, defineMessages } from 'react-intl';
import config from '@plone/volto/registry';
import HeaderContainer from '../../../../components/HeaderContainer/HeaderContainer';
// eslint-disable-next-line import/no-unresolved
import BarraAcessibilidade from 'volto-site-componentes/components/BarraAcessibilidade/BarraAcessibilidade';
// eslint-disable-next-line import/no-unresolved
import BarraEstado from 'volto-site-componentes/components/BarraEstado/BarraEstado';

import icon from '../../../images/govrs.svg'

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
      <BarraEstado />
      <BarraAcessibilidade svgImage={icon} />
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
