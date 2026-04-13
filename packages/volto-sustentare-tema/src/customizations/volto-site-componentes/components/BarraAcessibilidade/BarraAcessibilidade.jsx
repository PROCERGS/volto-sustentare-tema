import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleHalfStroke,
  faEnvelope,
  faSitemap,
  faUniversalAccess,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const BarraAcessibilidade = ({ svgImage }) => {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('isHighContrast') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const mainElement = document.getElementById('main');
      if (mainElement) {
        if (isHighContrast) {
          mainElement.classList.add('high-contrast');
        } else {
          mainElement.classList.remove('high-contrast');
        }
      }

      localStorage.setItem('isHighContrast', isHighContrast);
    }
  }, [isHighContrast]);

  const toggleContrast = () => {
    setIsHighContrast((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isAlt1 =
        event.altKey &&
        (event.key === '1' ||
          event.code === 'Digit1' ||
          event.code === 'Numpad1');

      const isAlt2 =
        event.altKey &&
        (event.key === '2' ||
          event.code === 'Digit2' ||
          event.code === 'Numpad2');

      const isAlt3 =
        event.altKey &&
        (event.key === '3' ||
          event.code === 'Digit3' ||
          event.code === 'Numpad3');

      if (isAlt1) {
        const el = document.getElementById('view');
        el?.scrollIntoView({ behavior: 'smooth' });
      }

      if (isAlt2) {
        const el = document.getElementById('navigation');
        el?.scrollIntoView({ behavior: 'smooth' });
      }

      if (isAlt3) {
        const el = document.getElementsByClassName('nav-search-icon')[0];
        if (el) {
          el.click();
          const focusInput = () => {
            const input = document.getElementById('buscageralTextBox');
            if (input) {
              input.focus();
              el?.scrollIntoView({ behavior: 'smooth' });
            } else {
              setTimeout(focusInput, 50);
            }
          };
          focusInput();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="acessibilidade">
      <div className="acess-container">
        <div className="acess-wrapper">
          <div className="acess-menus">
            <div className="acess-right">
              <ul className="acess-ul">
                <li>
                  <a title="Ir para o conteúdo" href="#view">
                    Conteúdo [1]
                  </a>{' '}
                </li>
                <li>
                  <a title="Ir para o menu" href="#navigation">
                    Menu [2]
                  </a>{' '}
                </li>
                <li>
                  <a title="Ir para a busca" href="#buscageralTextBox">
                    Busca [3]
                  </a>{' '}
                </li>
                <li>
                  <a href="/acessibilidade">
                    <FontAwesomeIcon
                      icon={faUniversalAccess}
                      height={'12px'}
                      width={'12px'}
                    />{' '}
                    Acessibilidade
                  </a>
                </li>
              </ul>
            </div>
            <div className="acess-left">
              <ul className="acess-ul">
                <li>
                  <span
                    onClick={toggleContrast}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleContrast();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    style={{ cursor: 'pointer' }}
                    aria-label="Alternar alto contraste"
                  >
                    <FontAwesomeIcon
                      icon={faCircleHalfStroke}
                      height={'16px'}
                      width={'16px'}
                      id="btn-contraste"
                    />
                  </span>
                </li>
                <li>
                  <a aria-label="formulário de contato" href="/contact-form">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      height={'16px'}
                      width={'16px'}
                    />
                  </a>
                </li>
                <li>
                  <Link to="/sitemap" aria-label="mapa do site">
                    <FontAwesomeIcon
                      icon={faSitemap}
                      height={'16px'}
                      width={'16px'}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BarraAcessibilidade.propTypes = {
  svgImage: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

BarraAcessibilidade.defaultProps = {
  svgImage: null,
};

export default BarraAcessibilidade;
