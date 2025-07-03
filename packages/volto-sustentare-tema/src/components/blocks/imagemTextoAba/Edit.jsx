import React from 'react';
import {
  BlockDataForm,
  TextWidget,
  SidebarPortal,
} from '@plone/volto/components';
import ImagemTextoAbaSchema from './schema';
import ImagemTextoAbaBlockView from './View';
import { useIntl } from 'react-intl';

const Edit = (props) => {
  const { selected, block, data, onChangeBlock } = props;

  const intl = useIntl();
  const schema = ImagemTextoAbaSchema({ ...props, intl });
  const onChangeField = (id, value) => {
    onChangeBlock(block, {
      ...data,
      [id]: value,
    });
  };

  return (
    <>
      <ImagemTextoAbaBlockView {...props} isEditMode />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={schema.title}
          onChangeField={onChangeField}
          onChangeBlock={onChangeBlock}
          formData={data}
          block={block}
        />
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
    </>
  );
};

export default Edit;
