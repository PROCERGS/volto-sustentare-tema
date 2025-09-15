import React from 'react';
import { BlockDataForm, SidebarPortal } from '@plone/volto/components';
import CardsSchema from './schema';
import View from './View';
import config from '@plone/volto/registry';

const Edit = (props) => {
  const { selected, block, data, onChangeBlock } = props;
  const schema = CardsSchema({ formData: data });

  const normalizePath = (url) => {
    if (!url) return url;
    try {
      const { settings } = config;
      const prefixes = [
        settings?.apiPath,
        settings?.internalApiPath,
        '/++api++',
        '/api',
        '/Plone',
      ].filter(Boolean);

      let out = url;
      if (typeof out === 'object') {
        out = out['@id'] || out.url || out.href || out.value || '';
      }

      out = String(out);

      try {
        const u = new URL(out, window?.location?.origin || 'http://local');
        const origin = `${u.protocol}//${u.host}`;
        prefixes.forEach((p) => {
          if (!p) return;
          if (p.startsWith('http')) {
            if (out.startsWith(p)) {
              out = out.slice(p.length) || '/';
            }
          } else {
            const absP = `${origin}${p}`;
            if (out.startsWith(absP)) out = out.slice(absP.length) || '/';
            if (out.startsWith(p)) out = out.slice(p.length) || '/';
          }
        });
        if (!out.startsWith('/')) out = `/${out}`;
      } catch (_e) {
        if (!out.startsWith('http') && !out.startsWith('/')) out = `/${out}`;
      }

      return out;
    } catch (_err) {
      return url;
    }
  };

  const onChangeField = (id, value) => {
    let newValue = value;
    if (id === 'cards' && Array.isArray(value)) {
      newValue = value.map((card) => ({
        ...card,
        button_url: normalizePath(card?.button_url),
      }));
    }
    onChangeBlock(block, {
      ...data,
      [id]: newValue,
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
