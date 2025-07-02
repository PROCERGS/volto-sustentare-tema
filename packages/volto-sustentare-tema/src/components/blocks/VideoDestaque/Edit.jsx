import React from 'react';
import {
  SidebarPortal,
  TextWidget,
  TextareaWidget,
  SelectWidget,
} from '@plone/volto/components';
import VideoDestaqueSchema from './schema';

const Edit = (props) => {
  const { data, onChangeBlock, block, selected } = props;
  const schema = VideoDestaqueSchema({ formData: data });
  const borderColor = data.border_color || '#000000';

  return (
    <div
      className={`block video-destaque-block video-${data.video_position || 'left'}`}
    >
      <SidebarPortal selected={selected}>
        <TextWidget
          id="video_url"
          title={schema.properties.video_url.title}
          value={data.video_url}
          onChange={(id, value) =>
            onChangeBlock(block, { ...data, video_url: value })
          }
        />
        <TextWidget
          id="title"
          title={schema.properties.title.title}
          value={data.title}
          onChange={(id, value) =>
            onChangeBlock(block, { ...data, title: value })
          }
        />
        <TextareaWidget
          id="text"
          title={schema.properties.text.title}
          value={data.text}
          onChange={(id, value) =>
            onChangeBlock(block, { ...data, text: value })
          }
        />
        <SelectWidget
          id="video_position"
          title={schema.properties.video_position.title}
          value={data.video_position || 'left'}
          choices={schema.properties.video_position.choices}
          onChange={(id, value) =>
            onChangeBlock(block, { ...data, video_position: value })
          }
        />
        <TextWidget
          id="border_color"
          title={schema.properties.border_color.title}
          value={borderColor}
          onChange={(id, value) =>
            onChangeBlock(block, { ...data, border_color: value })
          }
        />
        <input
          type="checkbox"
          id="show_button"
          checked={!!data.show_button}
          onChange={(e) =>
            onChangeBlock(block, { ...data, show_button: e.target.checked })
          }
          style={{ margin: '15px 20px' }}
        />
        <label htmlFor="show_button" className="padding">
          {schema.properties.show_button.title}
        </label>
        {data.show_button && (
          <>
            <TextWidget
              id="button_text"
              title={schema.properties.button_text.title}
              value={data.button_text}
              onChange={(id, value) =>
                onChangeBlock(block, { ...data, button_text: value })
              }
            />
            <TextWidget
              id="button_url"
              title={schema.properties.button_url.title}
              value={data.button_url}
              onChange={(id, value) =>
                onChangeBlock(block, { ...data, button_url: value })
              }
            />
          </>
        )}
      </SidebarPortal>
      <div className="video-destaque-inner">
        <div style={{ flex: 1 }}>
          {data.video_url && (
            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
              }}
            >
              <iframe
                src={getEmbedUrl(data.video_url)}
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
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          {data.title && <h2>{data.title}</h2>}
          {data.text && <p>{data.text}</p>}
          {data.show_button && data.button_text && (
            <button
              type="button"
              className="video-destaque-botao"
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

function getEmbedUrl(url) {
  if (!url) return '';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('vimeo.com')) {
    const id = url.split('/').pop();
    return `https://player.vimeo.com/video/${id}`;
  }
  return url;
}

export default Edit;
