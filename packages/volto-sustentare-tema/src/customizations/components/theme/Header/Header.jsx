// SemanticUI-free pre-@plone/components
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl, defineMessages } from 'react-intl';
import config from '@plone/volto/registry';
import HeaderContainer from '../../../../components/HeaderContainer/HeaderContainer';
import * as VoltoSiteComponentes from 'volto-site-componentes';

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

  // SVG previously in BarraAcessibilidade
  const barraSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="33"
      viewBox="0 0 25 33"
      fill="none"
      style={{ marginRight: '16px' }}
    >
      <rect
        y="0.355957"
        width="24.417"
        height="32"
        fill="url(#pattern0_2425_1258)"
      />
      <defs>
        <pattern
          id="pattern0_2425_1258"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            href="#image0_2425_1258"
            transform="scale(0.00621118 0.00473934)"
          />
        </pattern>
        <image
          id="image0_2425_1258"
          width="161"
          height="211"
          preserveAspectRatio="none"
          href="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );

  return (
    <header className="header-wrapper">
      <VoltoSiteComponentes.BarraEstado />
      <VoltoSiteComponentes.BarraAcessibilidade svgImage={barraSvg} />
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
