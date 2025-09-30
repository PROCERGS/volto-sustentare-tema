import React, { useState } from 'react';
import './videoDestaque.css';

function getYoutubeId(url) {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/,
  );
  return match ? match[1] : '';
}

const View = ({ data }) => {
  const [showIframe, setShowIframe] = useState(false);
  const borderColor = data.border_color || 'var(--verde-padrao)';
  const youtubeId = getYoutubeId(data.video_url);
  const thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div
      className={`block video-destaque-block video-${data.video_position || 'left'}`}
    >
      {data.title && (
        <h2 className="video-destaque-title-hidden">{data.title}</h2>
      )}
      <div className="video-destaque-inner">
        <div className="video-destaque-video">
          {youtubeId && !showIframe && (
            <div
              className="video-destaque-thumb"
              style={{
                borderColor: borderColor,
              }}
              onClick={() => setShowIframe(true)}
              role="button"
              tabIndex={0}
              aria-label="Assistir vídeo"
              onKeyPress={(e) =>
                (e.key === 'Enter' || e.key === ' ') && setShowIframe(true)
              }
            >
              <img
                src={thumbnail}
                alt={data.title || 'Thumbnail do vídeo'}
                className="video-destaque-thumb-img"
              />
              <span className="video-destaque-svg-play">
                <svg
                  width="56"
                  height="68"
                  viewBox="0 0 56 68"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_d_2529_1950)">
                    <path
                      d="M4.45459 0.300964V59.411L51.2444 29.856L4.45459 0.300964Z"
                      fill="#2D2D2D"
                    />
                    <path
                      className="svg-play-hover"
                      d="M47.4985 29.8557L6.45459 55.7814V3.92987L47.4985 29.8557Z"
                      stroke="#00B033"
                      strokeWidth="4"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_d_2529_1950"
                      x="0.45459"
                      y="0.300964"
                      width="54.7898"
                      height="67.11"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_2529_1950"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_2529_1950"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
              </span>
            </div>
          )}
          {(showIframe || !youtubeId) && data.video_url && (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title={data.title}
              frameBorder="0"
              allowFullScreen
              style={{
                borderColor: borderColor,
                borderStyle: 'solid',
                borderWidth: '4px',
              }}
              className="video-destaque-iframe"
            />
          )}
        </div>
        <div className="video-destaque-content">
          {data.title && <h2 className="video-destaque-title">{data.title}</h2>}
          {data.text && <p>{data.text}</p>}
          {data.show_button && data.button_text && (
            <button
              type="button"
              className="video-destaque-botao themed-button"
              onClick={() => {
                if (data.button_url) {
                  window.open(data.button_url, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {data.button_text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default View;
