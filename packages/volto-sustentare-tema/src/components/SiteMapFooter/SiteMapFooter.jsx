import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Container as SemanticContainer } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import config from '@plone/volto/registry';
import { getNavigation } from '@plone/volto/actions';
import { toBackendLang } from '@plone/volto/helpers';
import { useCO2Estimate } from '../../hooks/useCO2Estimate';
import './SiteMapFooter.css';
import GOVRSLogo from './img/GOVRS_tons_branco_RGB_Horizontal_conceito.png';

function readCachedNavigation() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    return JSON.parse(window.sessionStorage.getItem('navigationItems') || '[]');
  } catch (error) {
    return [];
  }
}

function SitemapFooter({ items, lang, getNavigation }) {
  const co2 = useCO2Estimate();
  const [cachedItems, setCachedItems] = useState(() => readCachedNavigation());
  const [localData, setLocalData] = useState(null);

  useEffect(() => {
    const { settings } = config;
    const language = settings.isMultilingual ? toBackendLang(lang) : null;
    const rootPath = settings.isMultilingual && language ? `/${language}` : '/';
    getNavigation(rootPath, 4);
    const fetchLocal = async () => {
      try {
        const res = await fetch('/++api++/?navroot&expand.navigation.depth=3');
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        const local = data?.local?.data ?? null;
        setLocalData(local);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[SiteMapFooter] fetch local failed', err);
      }
    };

    fetchLocal();
  }, [lang, getNavigation]);

  useEffect(() => {
    if (!items?.length) {
      return;
    }

    setCachedItems(items);

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('navigationItems', JSON.stringify(items));
    }
  }, [items]);

  const navigationItems = items?.length ? items : cachedItems;

  const address = (() => {
    if (!localData) return '';
    const parts = [];
    if (localData.logradouro) parts.push(localData.logradouro);
    if (localData.numero) parts.push(localData.numero);
    if (localData.bairro) parts.push(localData.bairro);
    if (localData.municipio || localData.estado) {
      const muniEstado = [localData.municipio, localData.estado]
        .filter(Boolean)
        .join(' - ');
      if (muniEstado) parts.push(muniEstado);
    }
    if (localData.cep) parts.push(`CEP ${localData.cep}`);
    return parts.join(', ');
  })();

  const telefoneFax = localData?.telefone_fax;
  const email = localData?.email;

  const renderItems = (items) => {
    return (
      <ul className="rodape__mapa-site rodape__mapa-site__item">
        {items.slice(0, 3).map((item) => (
          <React.Fragment key={item.title}>
            {item.items.length > 0 && (
              <li className="rodape__mapa-site__item" key={item.title}>
                <p className="rodape-titulo font-weight-bold">{item.title}</p>
                <ul>
                  {item.items &&
                    item.items.map((innerItem) => (
                      <li key={innerItem.title}>
                        <Link to={innerItem.url}>{innerItem.title}</Link>
                      </li>
                    ))}
                </ul>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    );
  };

  const Container =
    config.getComponent({ name: 'Container' }).component || SemanticContainer;

  return (
    <Container className="view-wrapper">
      <div className="footer-images">
        <Link to="/" aria-label="Ir para a página inicial">
          <svg
            width="164"
            height="96"
            viewBox="0 0 164 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.45249 40.5374L0.404425 35.6367H6.69548C7.22017 35.6367 7.38141 35.4913 7.38141 35.0922V30.3012C7.38141 29.5756 7.09858 29.5386 6.29237 29.5386H3.26712C1.53311 29.5386 0 29.1752 0 26.5623V17.6332C0 15.5648 1.20931 14.2207 3.95305 14.2207H12.0191L13.0275 19.1214H6.41264C5.92892 19.1214 5.68706 19.3024 5.68706 19.7016V24.4926C5.68706 25.0371 5.96989 25.1825 6.57389 25.1825H10.2441C12.0997 25.1825 13.1478 25.9081 13.1478 27.8681V36.5434C13.1478 39.447 12.0191 40.5361 8.67134 40.5361H1.45249V40.5374Z"
              fill="#00B033"
            />
            <path
              d="M20.1261 40.5374C16.7784 40.5374 15.5691 39.3757 15.5691 36.472V14.2207H21.5377V35.346C21.5377 35.7451 21.6183 35.9262 22.102 35.9262H24.1585C24.6422 35.9262 24.7228 35.7451 24.7228 35.346V14.2207H30.6914V36.472C30.6914 39.3757 29.4821 40.5374 26.1344 40.5374H20.1248H20.1261Z"
              fill="#00B033"
            />
            <path
              d="M34.5638 40.5374L33.5158 35.6367H39.8068C40.3315 35.6367 40.4927 35.4913 40.4927 35.0922V30.3012C40.4927 29.5756 40.2099 29.5386 39.4037 29.5386H36.3784C34.6444 29.5386 33.1113 29.1752 33.1113 26.5623V17.6332C33.1113 15.5648 34.3206 14.2207 37.0644 14.2207H45.1304L46.1388 19.1214H39.524C39.0402 19.1214 38.7984 19.3024 38.7984 19.7016V24.4926C38.7984 25.0371 39.0812 25.1825 39.6852 25.1825H43.3554C45.211 25.1825 46.2591 25.9081 46.2591 27.8681V36.5434C46.2591 39.447 45.1304 40.5361 41.7827 40.5361H34.5638V40.5374Z"
              fill="#00B033"
            />
            <path
              d="M59.81 14.2217L61.2625 19.1224H57.3504V40.5384H51.3818V19.1224H47.4697L49.0028 14.2217H59.8113H59.81Z"
              fill="#00B033"
            />
            <path
              d="M62.8749 14.2217H74.249L75.2574 19.1224H68.8844V25.3658H73.7243V29.9031H68.8844V35.6377H75.0142L74.0058 40.5384H62.8749V14.2217Z"
              fill="#00B033"
            />
            <path
              d="M77.2729 14.2217H82.8384L85.8227 24.7843V14.2217H91.8322V40.5384H85.8227L82.6772 29.5396V40.5384H77.2729V14.2217Z"
              fill="#00B033"
            />
            <path
              d="M105.788 14.2217L107.24 19.1224H103.328V40.5384H97.3593V19.1224H93.4473L94.9804 14.2217H105.789H105.788Z"
              fill="#00B033"
            />
            <path
              d="M112.038 37.2703L111.513 40.5374H105.625L110.909 14.2207H117.16L122.444 40.5374H116.556L116.032 37.2703H112.039H112.038ZM112.684 33.0965H115.387L114.056 23.7683L112.684 33.0965Z"
              fill="#00B033"
            />
            <path
              d="M139.1 29.8294C139.1 30.9911 138.172 32.1528 136.479 32.1528L139.544 40.5374H133.495L130.672 32.1528H129.905V40.5374H124.057V14.2207H135.148C137.89 14.2207 139.101 15.5635 139.101 17.6332V29.8294H139.1ZM129.905 18.8319V27.9064H132.769C133.213 27.9064 133.333 27.761 133.333 27.3619V19.3765C133.333 19.05 133.172 18.8319 132.769 18.8319H129.905Z"
              fill="#00B033"
            />
            <path
              d="M140.107 40.5374V37.8584H143.083V40.5374H140.107Z"
              fill="#F0EAD7"
            />
            <path
              d="M157.127 32.3511L163.381 33.489C162.578 35.975 161.307 37.8689 159.573 39.1681C157.838 40.4686 155.668 41.1176 153.063 41.1176C148.938 41.1176 145.885 39.6558 143.905 36.7337C142.342 34.393 141.561 31.4378 141.561 27.8693C141.561 23.607 142.588 20.2685 144.643 17.8552C146.698 15.4419 149.296 14.2339 152.438 14.2339C155.967 14.2339 158.751 15.4974 160.792 18.0244C162.831 20.5514 163.807 24.4225 163.718 29.6377H147.993C148.038 31.6559 148.544 33.226 149.512 34.3481C150.479 35.4702 151.686 36.0319 153.13 36.0319C154.114 36.0319 154.94 35.7411 155.61 35.1596C156.28 34.578 156.786 33.6423 157.128 32.3497L157.127 32.3511ZM157.484 25.4732C157.439 23.5039 156.97 22.0065 156.076 20.9809C155.183 19.9553 154.095 19.4425 152.816 19.4425C151.445 19.4425 150.314 19.9831 149.421 21.0655C148.527 22.1479 148.088 23.6163 148.103 25.4732H157.484Z"
              fill="#F0EAD7"
            />
            <path
              d="M5.27753 0C6.33221 0 6.8688 0.582848 6.8688 1.46571V7.24396C6.8688 8.15987 6.46173 8.85902 4.96298 8.85902H2.6686V12.0733H0.00415039V0H5.27753ZM2.6686 2.11596V6.86201H4.00082C4.22286 6.86201 4.25986 6.79592 4.25986 6.61221V2.34857C4.25986 2.19923 4.20435 2.11596 4.01932 2.11596H2.6686Z"
              fill="#00B033"
            />
            <path
              d="M14.825 7.16202C14.825 7.69465 14.3994 8.22727 13.6223 8.22727L15.0285 12.0746H12.2531L10.9578 8.22727H10.6063V12.0746H7.92334V0H13.0117C14.2699 0 14.825 0.615889 14.825 1.56483V7.1607V7.16202ZM10.6063 2.11596V6.27916H11.92C12.1235 6.27916 12.1791 6.21308 12.1791 6.02937V2.36575C12.1791 2.21641 12.105 2.11596 11.92 2.11596H10.6063Z"
              fill="#00B033"
            />
            <path
              d="M22.9293 10.3592C22.9293 11.2751 22.5038 12.0747 21.005 12.0747H17.8965C16.3977 12.0747 15.9722 11.2751 15.9722 10.3592V1.5663C15.9722 0.617354 16.5273 0.00146484 17.7855 0.00146484H21.116C22.3742 0.00146484 22.9293 0.617354 22.9293 1.5663V10.3592ZM18.9142 2.1161C18.7291 2.1161 18.6736 2.19937 18.6736 2.34872V9.7103C18.6736 9.89401 18.7106 9.9601 18.9327 9.9601H19.9503C20.1724 9.9601 20.2094 9.89401 20.2094 9.7103V2.34872C20.2094 2.19937 20.1539 2.1161 19.9688 2.1161H18.9142Z"
              fill="#00B033"
            />
            <path
              d="M24.0396 1.46571C24.0396 0.582848 24.5761 0 25.6308 0H29.461L29.9235 2.24813H26.9815C26.7965 2.24813 26.741 2.33139 26.741 2.48074V9.64143C26.741 9.79078 26.7965 9.87405 26.9815 9.87405H28.2027V5.11082H30.8117V12.0719H26.1304C24.5946 12.0719 24.0396 11.5393 24.0396 10.2071V1.46571Z"
              fill="#00B033"
            />
            <path
              d="M38.768 7.16202C38.768 7.69465 38.3424 8.22727 37.5653 8.22727L38.9715 12.0746H36.1961L34.9008 8.22727H34.5493V12.0746H31.8663V0H36.9547C38.2129 0 38.768 0.615889 38.768 1.56483V7.1607V7.16202ZM34.5493 2.11596V6.27916H35.863C36.0665 6.27916 36.122 6.21308 36.122 6.02937V2.36575C36.122 2.21641 36.048 2.11596 35.863 2.11596H34.5493Z"
              fill="#00B033"
            />
            <path
              d="M42.3576 10.576L42.1171 12.0747H39.4156L41.8396 0.00146484H44.7075L47.1314 12.0747H44.43L44.1894 10.576H42.3576ZM42.6537 8.66092H43.8934L43.2828 4.38141L42.6537 8.66092Z"
              fill="#00B033"
            />
            <path
              d="M50.4804 6.37828V12.0733H47.8715V0H50.7024L52.1642 5.09628L53.6259 0H56.4754V12.0733H53.8665V6.37828L52.1642 11.2076L50.4804 6.37828Z"
              fill="#00B033"
            />
            <path
              d="M60.1576 10.576L59.917 12.0747H57.2156L59.6395 0.00146484H62.5075L64.9314 12.0747H62.2299L61.9894 10.576H60.1576ZM60.4536 8.66092H61.6933L61.0827 4.38141L60.4536 8.66092Z"
              fill="#00B033"
            />
            <path
              d="M66.0125 58.8698L71.233 49.9487C71.233 49.9487 73.0502 47.3384 76.3213 48.0653C79.5924 48.7922 79.9559 50.4443 82.1696 54.0128L75.9909 64.652L66.0125 58.8698Z"
              fill="#00B033"
            />
            <path
              d="M101.466 62.2666L106.631 71.2208C106.631 71.2208 107.999 74.0927 105.747 76.5735C103.494 79.0555 101.879 78.5533 97.6832 78.7092L91.5005 68.0726L101.466 62.2679V62.2666Z"
              fill="#00B033"
            />
            <path
              d="M81.0132 91.3164L70.6766 91.3085C70.6766 91.3085 67.5059 91.056 66.4843 87.8643C65.4627 84.6725 66.705 83.5266 68.6703 79.8141L80.9735 79.7837L81.0132 91.3164Z"
              fill="#00B033"
            />
            <path
              d="M78.4136 47.5091H91.6737C91.6737 47.5091 92.731 47.4721 93.3152 48.2863C93.8993 49.1017 96.9391 54.3103 96.9391 54.3103L100.332 52.2512L94.8245 62.2072L83.5019 62.0195L86.9818 59.9934L81.2551 50.0811C81.2551 50.0811 79.989 48.0418 78.4136 47.5078V47.5091Z"
              fill="#00B033"
            />
            <path
              d="M64.7966 86.232L58.2359 74.7086C58.2359 74.7086 57.6795 73.8085 58.0998 72.8979C58.5201 71.9873 61.5427 66.7681 61.5427 66.7681L58.0747 64.8398L69.4514 64.6997L74.89 74.6319L71.4075 72.6098L65.6266 82.4918C65.6266 82.4918 64.4807 84.6011 64.7966 86.2347V86.232Z"
              fill="#00B033"
            />
            <path
              d="M105.063 78.6815L98.4735 90.1891C98.4735 90.1891 97.9805 91.1249 96.984 91.2266C95.9875 91.3284 89.9555 91.3773 89.9555 91.3773L90.0572 95.3449L84.1534 85.6189L89.9423 75.8862L89.9713 79.9133L101.419 79.8684C101.419 79.8684 103.818 79.7825 105.065 78.6802L105.063 78.6815Z"
              fill="#00B033"
            />
          </svg>
        </Link>

        <a
          href="https://www.estado.rs.gov.br"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ir para o site do Estado"
        >
          <img
            src={GOVRSLogo}
            alt="Logo do Governo do Estado do Rio Grande do Sul"
            width="200"
          />
        </a>

        <div className="co2-badge">
          <span className="co2-badge-label">Esse website emite</span>
          <span className="co2-badge-value">
            {co2
              ? `${co2.toFixed(3).replace('.', ',')}g de CO₂`
              : 'Calculando...'}
          </span>
          <span className="co2-badge-label">por visualização</span>
        </div>
      </div>
      {navigationItems?.length ? renderItems(navigationItems, 2) : null}
      <li className="rodape__procergs">
        <p className="font-weight-bold">PROCERGS</p>
        {address ? <p>{address}</p> : null}
        {telefoneFax ? <p className="font-weight-bold">{telefoneFax}</p> : null}
        {email ? <p className="font-weight-bold">{email}</p> : null}
      </li>
    </Container>
  );
}

SitemapFooter.propTypes = {
  getNavigation: PropTypes.func.isRequired,
  items: PropTypes.array,
  lang: PropTypes.string.isRequired,
};

SitemapFooter.defaultProps = {
  items: [],
};

export default injectIntl(
  connect(
    (state) => ({
      items: state.navigation?.items || [],
      lang: state.intl.locale,
    }),
    { getNavigation },
  )(SitemapFooter),
);
