import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import config from '@plone/volto/registry';
import SearchWidget from '../SearchWidget/SearchWidget';
import SustentareLogo from '../icons/SustentareLogo';
import SustentareLogoHighContrast from '../icons/SustentareLogoHighContrast';
import { HomeIconDesktop, HomeIconMobile } from '../icons/HomeIcon';
import { SearchIconDesktop, SearchIconMobile } from '../icons/SearchIcon';
import ArrowIcon from '../icons/ArrowIcon';
import { useGoogleAnalytics } from 'volto-google-analytics';

function normalizePathname(pathname) {
  if (!pathname) return '';
  try {
    const url = new URL(
      pathname,
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost',
    );
    pathname = url.pathname;
  } catch (err) {}
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname || '/';
}

function isImmediateChild(parentPath, childPath) {
  const parent = normalizePathname(parentPath) || '/';
  const child = normalizePathname(childPath) || '';

  if (!child || child === parent) return false;

  const parentParts = parent.split('/').filter(Boolean).length;
  const childParts = child.split('/').filter(Boolean).length;
  const isDirectPrefix =
    parent === '/' ? child.startsWith('/') : child.startsWith(`${parent}/`);

  return isDirectPrefix && childParts === parentParts + 1;
}

const HeaderContainer = ({ pathname }) => {
  const [navigationItems, setNavigationItems] = useState([]);

  useEffect(() => {
    const settings = config?.settings || {};
    const languageSegment = pathname.split('/').filter(Boolean)[0];
    const isMultilingual = settings.isMultilingual;
    const supportedLanguages = settings.supportedLanguages || [];
    const language =
      isMultilingual && supportedLanguages.includes(languageSegment)
        ? languageSegment
        : null;
    const rootPath = isMultilingual && language ? `/${language}` : '/';

    try {
      const searchUrl = new URL('/++api++/@search', window.location.origin);
      searchUrl.searchParams.set('path.query', rootPath);
      searchUrl.searchParams.set('path.depth', '2');
      searchUrl.searchParams.set('review_state', 'published');
      searchUrl.searchParams.set('sort_on', 'getObjPositionInParent');
      searchUrl.searchParams.append('metadata_fields', 'exclude_from_nav');

      fetch(searchUrl.toString())
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((json) => {
          const normalizedRoot = normalizePathname(rootPath);
          const results = (json.items || []).filter(
            (it) => !it.exclude_from_nav,
          );
          const map = {};

          const getRelUrl = (id, url) => {
            const rel = id?.replace(window.location.origin, '') || url || '';
            return rel || '/';
          };

          const entries = results.map((it) => {
            const id = it['@id'] || it.url || '';
            const entry = {
              '@id': id,
              url: getRelUrl(id, it.url),
              title: it.title,
              items: [],
            };
            map[normalizePathname(id)] = entry;
            return entry;
          });

          const topItems = [];
          entries.forEach((entry) => {
            const entryPath = normalizePathname(
              entry['@id'] || entry.url || '',
            );
            const parentPathParts = entryPath.split('/').filter(Boolean);
            parentPathParts.pop();
            const parentPath = `/${parentPathParts.join('/')}` || '/';
            const parent = map[parentPath];

            if (isImmediateChild(normalizedRoot, entryPath)) {
              topItems.push(entry);
            } else if (parent && isImmediateChild(parentPath, entryPath)) {
              parent.items.push(entry);
            }
          });

          const rootItem = {
            '@id': window.location.origin + rootPath,
            url: rootPath,
            title: '',
          };
          setNavigationItems([rootItem, ...topItems]);
        })
        .catch(() => {});
    } catch (err) {}
  }, [pathname]);

  const [showBar, setShowBar] = useState(false);
  const buttonRef = useRef(null);
  const barRef = useRef(null);
  const [barTop, setBarTop] = useState(0);
  const [barLeft, setBarLeft] = useState(0);
  const [barWidth, setBarWidth] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const menuRef = useRef();
  useGoogleAnalytics();

  useEffect(() => {
    function checkHighContrast() {
      if (typeof document !== 'undefined') {
        const main = document.getElementById('main');
        setIsHighContrast(main && main.classList.contains('high-contrast'));
      }
    }
    checkHighContrast();
    let observer;
    if (typeof MutationObserver !== 'undefined') {
      const main = document.getElementById('main');
      if (main) {
        observer = new MutationObserver(checkHighContrast);
        observer.observe(main, {
          attributes: true,
          attributeFilter: ['class'],
        });
      }
    }
    window.addEventListener('resize', checkHighContrast);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', checkHighContrast);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setIsMobile(window.innerWidth < 767);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    return undefined;
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showBar && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setBarTop(rect.bottom);
    }
  }, [showBar]);

  useEffect(() => {
    if (!showBar) return;
    function handleClickOutside(event) {
      if (
        barRef.current &&
        !barRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowBar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBar]);

  useEffect(() => {
    function updateBarPosition() {
      const toolbar =
        document.getElementById('toolbar') ||
        document.querySelector('.toolbar-container');
      const sidebar = document.querySelector('.sidebar-container');
      let left = 0;
      let width = window.innerWidth;

      if (toolbar) {
        const toolbarRect = toolbar.getBoundingClientRect();
        left = toolbarRect.right;
        width = window.innerWidth - left;
      }
      if (sidebar) {
        const sidebarRect = sidebar.getBoundingClientRect();
        if (toolbar) {
          width = sidebarRect.left - left;
        } else {
          width = sidebarRect.left;
        }
      }

      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setBarTop(rect.bottom);
      }

      setBarLeft(left);
      setBarWidth(width);
    }

    if (showBar) {
      updateBarPosition();
      window.addEventListener('resize', updateBarPosition);
      window.addEventListener('scroll', updateBarPosition);
    }
    return () => {
      window.removeEventListener('resize', updateBarPosition);
      window.removeEventListener('scroll', updateBarPosition);
    };
  }, [showBar]);

  return (
    <>
      <div className="header">
        <div className="header-images">
          {isHighContrast ? (
            <Link
              to="/"
              aria-label="Ir para a página inicial"
              className="header-logo-link"
            >
              <SustentareLogoHighContrast />
            </Link>
          ) : (
            <Link
              to="/"
              aria-label="Ir para a página inicial"
              className="header-logo-link"
            >
              <SustentareLogo />
            </Link>
          )}
          {isHighContrast ? (
            isMobile ? (
              <a
                href="https://www.estado.rs.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ir para o site do Governo do Estado"
              >
                <img
                  src="/brasao-RS-contraste-mobile.svg"
                  alt="Brasão do RS contraste"
                  style={{ maxHeight: 120 }}
                />
              </a>
            ) : (
              <a
                href="https://www.estado.rs.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ir para o site do Governo do Estado"
              >
                <img
                  src="/brasao-RS-contraste.svg"
                  alt="Brasão do RS contraste"
                  style={{ maxHeight: 120 }}
                />
              </a>
            )
          ) : isMobile ? (
            <a
              href="https://www.estado.rs.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ir para o site do Governo do Estado"
            >
              <img
                src="/brasao-RS-mobile.svg"
                alt="Brasão do RS"
                style={{ maxHeight: 120 }}
              />
            </a>
          ) : (
            <a
              href="https://www.estado.rs.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ir para o site do Governo do Estado"
            >
              <img
                src="/brasao-RS.png"
                alt="Brasão do RS"
                style={{ maxHeight: 120 }}
              />
            </a>
          )}
        </div>
        <div
          className="logo-nav-wrapper home-icon"
          id="navigation"
          ref={menuRef}
          style={{ alignItems: 'center' }}
        >
          <div className="logo-nav-wrapper-content">
            <a
              className="nav-item"
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="icon-home-desktop">
                <HomeIconDesktop />
              </span>
              <span className="icon-home-mobile">
                <HomeIconMobile />
              </span>
            </a>
            {navigationItems.slice(1).map((item, idx) => {
              const hasSubitems = item.items && item.items.length > 0;
              const isActive = openMenu === idx;
              return (
                <div
                  key={item.url || idx}
                  className={`nav-item-wrapper${hasSubitems ? ' has-submenu' : ''}${isActive ? ' active' : ''}`}
                  style={{ position: 'relative', display: 'flex' }}
                >
                  {hasSubitems ? (
                    <button
                      type="button"
                      className="nav-item"
                      onClick={() => setOpenMenu(isActive ? null : idx)}
                    >
                      {item.title}
                      {isMobile && (
                        <span className={`nav-arrow${isActive ? ' up' : ''}`}>
                          <ArrowIcon isUp={isActive} />
                        </span>
                      )}
                    </button>
                  ) : (
                    <a className="nav-item" href={item.url || '#'}>
                      {item.title}
                    </a>
                  )}
                  {hasSubitems && isActive && (
                    <div className="submenu">
                      {item.items.map((sub, subIdx) => (
                        <a
                          key={sub.url || sub['@id'] || subIdx}
                          href={sub.url || sub['@id']}
                          className="submenu-item"
                        >
                          {sub.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <button
              className="nav-search-icon"
              ref={buttonRef}
              onClick={() => {
                setShowBar((v) => !v);
                setOpenMenu(null);
              }}
              aria-label="Abrir busca"
            >
              <span className="icon-search-desktop">
                <SearchIconDesktop />
              </span>
              <span className="icon-search-mobile">
                <SearchIconMobile />
              </span>
            </button>
            {showBar && (
              <div
                className="search-bar-absolute"
                ref={barRef}
                style={{
                  top: barTop,
                  left: barLeft,
                  width: barWidth,
                }}
              >
                <div style={{ width: '100%', padding: 16 }}>
                  <SearchWidget
                    pathname={pathname}
                    onSearchComplete={() => setShowBar(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderContainer;
