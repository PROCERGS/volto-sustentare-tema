import { SidebarPortal } from '@plone/volto/components';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import { BlocoEspacadorSchema } from './schema';
import { useIntl } from 'react-intl';

const Edit = ({ data, onChangeBlock, block, selected }) => {
  const intl = useIntl();
  const schema = BlocoEspacadorSchema({ intl });
  const height = data.height || 30;

  return (
    <>
      <div
        style={{
          height: `${height}px`,
        }}
      ></div>

      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
          onChangeBlock={onChangeBlock}
        />
      </SidebarPortal>
    </>
  );
};

export default Edit;
