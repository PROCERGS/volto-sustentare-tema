import React, { useState, useMemo } from 'react';
import './Cards.css';
import { flattenToAppURL } from '@plone/volto/helpers';

const Card = ({ card }) => {
    const [hover, setHover] = useState(false);
    const image_data = useMemo(() => card, [card]);
    const image_url = image_data?.image
        ? `${flattenToAppURL(image_data.image)}/@@images/image`
        : '';
    const image_hover_url = image_data?.image_hover
        ? `${flattenToAppURL(image_data.image_hover)}/@@images/image`
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
                {image_data.button_text && (
                    <button className="card-button">{image_data.button_text}</button>
                )}
            </div>
        </div>
    );
};

const View = ({ data }) => {
    const cards = data.cards || [];
    return (
        <div className="cards-block">
            {cards.map((card, idx) => (
                <Card card={card} key={idx} />
            ))}
        </div>
    );
};

export default View;