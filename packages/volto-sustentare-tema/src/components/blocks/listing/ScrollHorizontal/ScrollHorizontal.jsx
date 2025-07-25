import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PreviewLink from '../../../PreviewLink/PreviewLink';
import './ScrollHorizontal.css';
import { useCardWidth } from './useCardWidth';

const ScrollHorizontal = ({
  items = [],
  loading = false,
  total = 0,
  loadMore = () => {},
  data = {},
  isEditMode = false,
}) => {
  const containerRef = useRef(null);
  const [canLoad, setCanLoad] = useState(true);
  const cardWidth = useCardWidth();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (
        canLoad &&
        !loading &&
        container.scrollLeft + container.offsetWidth >=
          container.scrollWidth - 100 &&
        items.length < total
      ) {
        setCanLoad(false);
        loadMore();
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [canLoad, loading, items.length, total, loadMore]);

  useEffect(() => {
    if (!loading) setCanLoad(true);
  }, [loading]);

  return (
    <div className="noticias-horizontal-grid">
      <div className="noticias-horizontal-container" ref={containerRef}>
        {items.slice(0, 8).map((item) => (
          <div
            className="noticias-horizontal-item"
            key={item['@id']}
            style={cardWidth ? { width: cardWidth } : {}}
          >
            <div className="noticias-horizontal-image">
              <PreviewLink
                item={item}
                alt={item.title}
                className="noticias-horizontal-img"
                loading="lazy"
              />
            </div>
            <div
              className="noticias-horizontal-content"
              style={cardWidth ? { width: cardWidth - 10 } : {}}
            >
              <h3>{item.title}</h3>
              {item.description && <p>{item.description}</p>}
            </div>
            <Link to={item['@id']}>
              <button
                className="button-noticias-horizontal"
                aria-label={`Ver notícia: ${item.title}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="42"
                  height="18"
                  viewBox="0 0 42 18"
                  fill="none"
                >
                  <path
                    className="arrow-path-short"
                    d="M11.0503 14.6653L13.7873 17.5L22 9L13.7873 0.5L11.0503 3.33266L14.5886 6.9967L0 6.9967V11.0033L14.5886 11.0033L11.0503 14.6653Z"
                    fill="#00B033"
                  />
                  <path
                    className="arrow-path-long"
                    d="M31.0503 14.6653L33.7873 17.5L42 9L33.7873 0.5L31.0503 3.33266L34.5886 6.9967L0 6.9967V11.0033L34.5886 11.0033L31.0503 14.6653Z"
                    fill="#00B033"
                  />
                </svg>
              </button>
            </Link>
          </div>
        ))}

        {loading && (
          <div className="noticias-horizontal-loading">Carregando...</div>
        )}
      </div>
      {isEditMode && items.length === 0 && (
        <div className="noticias-horizontal-loading">
          Nenhuma notícia encontrada.
        </div>
      )}
    </div>
  );
};

export default ScrollHorizontal;
