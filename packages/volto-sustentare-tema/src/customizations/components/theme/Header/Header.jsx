// SemanticUI-free pre-@plone/components
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl, defineMessages } from 'react-intl';
import config from '@plone/volto/registry';
import { logout, purgeMessages } from '@plone/volto/actions';
import { toast } from 'react-toastify';
import HeaderContainer from '../../../../components/HeaderContainer/HeaderContainer';
import * as VoltoSiteComponentes from 'volto-site-componentes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

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
  const dispatch = useDispatch();
  const history = useHistory();
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

  useEffect(() => {
    const handler = (e) => {
      const target = e.target.closest && e.target.closest('#toolbar-logout');
      if (target) {
        e.preventDefault();
        if (typeof dispatch === 'function') {
          dispatch(logout());
          dispatch(purgeMessages());
          try {
            toast.dismiss('loggedOut');
          } catch (err) {}
        }
        if (history && typeof history.replace === 'function') {
          history.replace('/login');
        } else {
          window.location.assign('/login');
        }
      }
    };

    document.addEventListener('click', handler, true);
    return () => {
      document.removeEventListener('click', handler, true);
    };
  }, [dispatch, history]);

  return (
    <header className="header-wrapper">
      <VoltoSiteComponentes.BarraEstado />
      <VoltoSiteComponentes.BarraAcessibilidade />
      <HeaderContainer
        pathname={pathname}
        siteLabel={siteLabel}
        token={token}
        siteAction={siteAction}
        siteTitle={siteTitle}
      />
      <div style={{ textAlign: 'right' }}>
        <a href="#main" className="btn-scroll">
          <FontAwesomeIcon icon={faChevronUp} />
        </a>
      </div>
    </header>
  );
};

// (effect moved inside the component so it runs at mount time)

Header.propTypes = {
  token: PropTypes.string,
  pathname: PropTypes.string.isRequired,
};

Header.defaultProps = {
  token: null,
};

export default Header;
