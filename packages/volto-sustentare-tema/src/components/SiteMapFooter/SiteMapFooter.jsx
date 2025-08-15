import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Container as SemanticContainer } from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';
import config from '@plone/volto/registry';
import { getNavigation } from '@plone/volto/actions';
import { toBackendLang } from '@plone/volto/helpers';
import { useCO2Estimate } from '../../hooks/useCO2Estimate';
import './SiteMapFooter.css';

function getSitemapPath(pathname = '', lang) {
  const prefix = pathname.replace(/\/sitemap$/gm, '').replace(/^\//, '');
  const path = prefix || lang || '';
  return path;
}

function SitemapFooter({ items, lang, getNavigation }) {
  const location = useLocation();
  const co2 = useCO2Estimate();

  useEffect(() => {
    const { settings } = config;
    const language = settings.isMultilingual ? toBackendLang(lang) : null;
    const path = getSitemapPath(location.pathname, language);
    getNavigation(path, 4);
  }, [location.pathname, lang, getNavigation]);

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

        <svg
          width="165"
          height="60"
          viewBox="0 0 165 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
        >
          <rect
            y="0.344727"
            width="165"
            height="58.9286"
            fill="url(#pattern0_3152_4062)"
          />
          <defs>
            <pattern
              id="pattern0_3152_4062"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use
                href="#image0_3152_4062"
                transform="scale(0.00420168 0.0117647)"
              />
            </pattern>
            <image
              id="image0_3152_4062"
              width="238"
              height="85"
              preserveAspectRatio="none"
              href="data:image/png;base64,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"
            />
          </defs>
        </svg>

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
      {items && renderItems(items, 2)}
      <li className="rodape__procergs">
        <p className="font-weight-bold">PROCERGS</p>
        <p>
          Praça dos Açorianos S/N, Centro Histórico, Porto Alegre - RS. CEP
          90010-340
        </p>
        <p className="font-weight-bold">
          (51) 3210-3837 | (51) 3210-3487
          <br />
          (51) 3210-3829 | (51) 3210-3537
        </p>
        <p className="font-weight-bold">sustentare@procergs.rs.gov.br</p>
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
      items: state.navigation.items,
      lang: state.intl.locale,
    }),
    { getNavigation },
  )(SitemapFooter),
);
