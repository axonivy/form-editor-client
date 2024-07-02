import type { ComponentConfig, FieldOption, UiComponentProps } from '../../../types/config';
import './Layout.css';
import type { Layout, LayoutGridVariant, LayoutJustifyContent, LayoutType, Prettify } from '@axonivy/form-editor-protocol';
import { config } from '../../components';
import { ComponentBlock, EmtpyBlock } from '../../editor/canvas/Canvas';
import { LAYOUT_DROPZONE_ID_PREFIX } from '../../../data/data';
import { useAppContext } from '../../../context/useData';
import { defaultBaseComponent, baseComponentFields } from '../base';

type LayoutProps = Prettify<Layout>;

const typeOptions: FieldOption<LayoutType>[] = [
  { label: 'Grid', value: 'GRID' },
  { label: 'Flex', value: 'FLEX' }
] as const;

const gridVariantOptions: FieldOption<LayoutGridVariant>[] = [
  { label: '2 Columns', value: 'GRID2' },
  { label: '4 Columns', value: 'GRID4' },
  { label: 'Free', value: 'FREE' }
] as const;

const justifyContentOptions: FieldOption<LayoutJustifyContent>[] = [
  { label: 'Normal', value: 'NORMAL' },
  { label: 'End', value: 'END' }
] as const;

export const defaultLayoutProps: LayoutProps = {
  components: [],
  type: 'GRID',
  justifyContent: 'NORMAL',
  gridVariant: 'GRID2',
  ...defaultBaseComponent
};

export const LayoutComponent: ComponentConfig<LayoutProps> = {
  name: 'Layout',
  category: 'Structure',
  subcategory: 'General',
  icon: 'M2 20h8V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM13 20h8V4h-8v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1Z',
  description: 'A flexable layout',
  defaultProps: defaultLayoutProps,
  render: props => <LayoutBlock {...props} />,
  fields: {
    components: { type: 'hidden' },
    type: { type: 'select', options: typeOptions },
    justifyContent: {
      type: 'select',
      label: 'Justify content',
      options: justifyContentOptions,
      hide: data => data.type !== 'FLEX'
    },
    gridVariant: {
      type: 'select',
      label: 'Columns',
      options: gridVariantOptions,
      hide: data => data.type !== 'GRID'
    },
    ...baseComponentFields
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
          let componentCols = '';
          if (gridVariant === 'FREE') {
            componentCols = `col-span-${component.config.lgSpan ?? '6'} col-md-span-${component.config.mdSpan ?? '12'}`;
          }
          return (
            <ComponentBlock
              key={component.id}
              component={component}
              config={config}
              preId={components[index - 1]?.id}
              className={componentCols}
            />
          );
        })}
      </div>
      <EmtpyBlock id={`${LAYOUT_DROPZONE_ID_PREFIX}${id}`} preId={components[components.length - 1]?.id} />
    </>
  );
};
