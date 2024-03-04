import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import './Layout.css';
import type { Layout, Prettify } from '@axonivy/form-editor-protocol';
import { config } from '../../components';
import { ComponentBlock, EmtpyBlock } from '../../editor/canvas/Canvas';
import { LAYOUT_DROPZONE_ID_PREFIX } from '../../../data/data';
import { useAppContext } from '../../../context/useData';

type LayoutProps = Prettify<Layout>;

export const defaultLayoutProps: LayoutProps = {
  components: [],
  type: 'GRID',
  justifyContent: 'NORMAL',
  gridVariant: 'GRID2'
};

export const LayoutComponent: ComponentConfig<LayoutProps> = {
  name: 'Layout',
  category: 'Layout',
  icon: 'M2 20h8V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM13 20h8V4h-8v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1Z',
  description: 'A flexable layout',
  defaultProps: defaultLayoutProps,
  render: props => <LayoutBlock {...props} />,
  fields: {
    components: { type: 'hidden' },
    type: {
      type: 'select',
      options: [
        { label: 'Grid', value: 'GRID' },
        { label: 'Flex', value: 'FLEX' }
      ]
    },
    justifyContent: {
      type: 'select',
      label: 'Justify content',
      options: [
        { label: 'Normal', value: 'NORMAL' },
        { label: 'End', value: 'END' }
      ],
      hide: data => data.type !== 'FLEX'
    },
    gridVariant: {
      type: 'select',
      label: 'Columns',
      options: [
        { label: '2 Columns', value: 'GRID2' },
        { label: '4 Columns', value: 'GRID4' }
      ],
      hide: data => data.type !== 'GRID'
    }
  }
};

const LayoutBlock = ({ id, components, type, justifyContent, gridVariant }: UiComponentProps<LayoutProps>) => {
  const { ui } = useAppContext();
  return (
    <>
      <div
        className={`block-layout${type === 'GRID' ? ' grid' : ' flex'}${
          justifyContent === 'END' ? ' justify-end' : ''
        } ${`${gridVariant.toLocaleLowerCase()}`}`}
        data-responsive-mode={ui.responsiveMode}
      >
        {components.map((component, index) => {
          return <ComponentBlock key={component.id} component={component} config={config} preId={components[index - 1]?.id} />;
        })}
      </div>
      <EmtpyBlock id={`${LAYOUT_DROPZONE_ID_PREFIX}${id}`} preId={components[components.length - 1]?.id} />
    </>
  );
};
