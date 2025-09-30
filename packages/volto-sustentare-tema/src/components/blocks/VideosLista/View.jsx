import React, { useState } from 'react';
import './VideosLista.css';

function getYoutubeId(url) {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/,
  );
  return match ? match[1] : '';
}

const VideoThumb = ({ video }) => {
  const [showIframe, setShowIframe] = useState(false);
  const youtubeId = getYoutubeId(video.url);
  const thumbnail = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : null;

  return (
    <div className="video-lista-item">
      {youtubeId && !showIframe ? (
        <div
          className="video-lista-thumb"
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
            alt={video.title || 'Thumbnail do vídeo'}
            className="video-lista-thumb-img"
          />
          <span className="video-lista-svg-play">
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
      ) : youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={video.title}
          frameBorder="0"
          allowFullScreen
          className="video-lista-iframe"
        />
      ) : null}
      <div className="video-lista-content">
        {video.title && <h3>{video.title}</h3>}
      </div>
    </div>
  );
};

const View = ({ data }) => {
  const videos = data.videos || [];
  return (
    <div className="block-lista">
      {data.title && <h2 className="videos-lista-title">{data.title}</h2>}
      <div className="videos-lista-block">
        {videos.map((video, idx) => (
          <VideoThumb video={video} key={idx} />
        ))}
      </div>
      {data.show_button && (
        <button
          type="button"
          className="videos-lista-botao"
          onClick={() => {
            if (data.button_url) {
              window.open(data.button_url, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          MAIS VÍDEOS
        </button>
      )}
    </div>
  );
};

export default View;
