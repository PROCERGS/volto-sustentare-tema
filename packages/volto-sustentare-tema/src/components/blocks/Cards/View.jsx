import React, { useState, useMemo } from 'react';
import './Cards.css';

const Card = ({ card, buttonUrl }) => {
  const [hover, setHover] = useState(false);
  const image_data = useMemo(() => card, [card]);
  const image_url = image_data?.image
    ? `${
        typeof image_data.image === 'string'
          ? image_data.image
          : image_data.image?.['@id'] || ''
      }/@@images/image`
    : '';
  const image_hover_url = image_data?.image_hover
    ? `${
        typeof image_data.image_hover === 'string'
          ? image_data.image_hover
          : image_data.image_hover?.['@id'] || ''
      }/@@images/image`
    : '';
  const image_name = image_data?.title || '';

  return (
    <div className="card">
      <div className="card-image">
        {image_url && (
          <figure
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <img
              src={hover && image_hover_url ? image_hover_url : image_url}
              alt={image_name}
            />
          </figure>
        )}
      </div>
      <div className="card-content">
        {image_data.title && <h3>{image_data.title}</h3>}
        {image_data.text && <p>{image_data.text}</p>}
        {image_data.button_text && buttonUrl ? (
          <button
            type="button"
            className="link-button themed-button"
            onClick={() => {
              if (buttonUrl) {
                window.location.href = buttonUrl;
              }
            }}
          >
            {image_data.button_text}
          </button>
        ) : image_data.button_text ? (
          <button className="card-button themed-button">
            {image_data.button_text}
          </button>
        ) : null}
      </div>
    </div>
  );
};

const View = ({ data }) => {
  const cards = data.cards || [];
  return (
    <div className="block cards-block">
      {cards.map((card, idx) => (
        <Card card={card} buttonUrl={card?.button_url} key={idx} />
      ))}
    </div>
  );
};

export default View;
