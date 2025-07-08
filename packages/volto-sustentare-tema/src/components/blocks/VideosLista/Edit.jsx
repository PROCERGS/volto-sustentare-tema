import React from 'react';
import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import VideosListaSchema from './schema';
import View from './View';

const Edit = (props) => {
  const { selected, block, data, onChangeBlock } = props;
  const schema = VideosListaSchema({ formData: data });

  const onChangeField = (id, value) => {
    onChangeBlock(block, {
      ...data,
      [id]: value,
    });
  };

  return (
    <>
      <View data={data} isEditMode />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={schema.title}
          onChangeField={onChangeField}
          onChangeBlock={onChangeBlock}
          formData={data}
        />
      </SidebarPortal>
    </>
  );
};

export default Edit;
