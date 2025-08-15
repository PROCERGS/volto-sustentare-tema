import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import SiteMapFooter from '../../../../components/SiteMapFooter/SiteMapFooter';
import './Footer.css';

const Footer = () => {
  return (
    <div id="footer" color="grey">
      <div className="footer-container">
        <SiteMapFooter location={{ pathname: '/' }} />
      </div>
      <div className="footer-logo">
        <div className="footer-images">
          <Link to="/" aria-label="Ir para a página inicial">
            <svg
              viewBox="0 0 101 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <rect width="101" height="21" fill="url(#pattern0_3279_15755)" />
              <defs>
                <pattern
                  id="pattern0_3279_15755"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlinkHref="#image0_3279_15755"
                    transform="matrix(0.00990099 0 0 0.047619 -0.00174378 0.0471754)"
                  />
                </pattern>
                <image
                  id="image0_3279_15755"
                  width="205"
                  height="19"
                  preserveAspectRatio="none"
                  xlinkHref="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </Link>

          <Link to="/termos_de_uso" aria-label="Ir para os termos de uso">
            <svg
              viewBox="0 0 102 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <rect width="102" height="21" fill="url(#pattern0_3279_15758)" />
              <defs>
                <pattern
                  id="pattern0_3279_15758"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlinkHref="#image0_3279_15758"
                    transform="matrix(0.00980392 0 0 0.047619 -1.02133 0.0471754)"
                  />
                </pattern>
                <image
                  id="image0_3279_15758"
                  width="205"
                  height="19"
                  preserveAspectRatio="none"
                  xlinkHref="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(Footer);
