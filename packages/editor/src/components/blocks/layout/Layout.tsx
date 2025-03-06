import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import './Layout.css';
import type {
  Layout,
  LayoutGridVariant,
  LayoutJustifyContent,
  LayoutAlignItems,
  LayoutType,
  Prettify
} from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../context/AppContext';
import { defaultBaseComponent, baseComponentFields, defaultVisibleComponent, visibleComponentField } from '../base';
import IconSvg from './Layout.svg?react';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { EmptyLayoutBlock } from '../../../editor/canvas/EmptyBlock';
import { UiBlockHeader } from '../../UiBlockHeader';
import { IvyIcons } from '@axonivy/ui-icons';

type LayoutProps = Prettify<Layout>;

const typeOptions: FieldOption<LayoutType>[] = [
  { label: 'Grid', value: 'GRID' },
  { label: 'Flex', value: 'FLEX' }
] as const;

const gridVariantOptions: FieldOption<LayoutGridVariant>[] = [
  { label: '1 Column', value: 'GRID1' },
  { label: '2 Columns', value: 'GRID2' },
  { label: '4 Columns', value: 'GRID4' },
  { label: 'Free', value: 'FREE' }
] as const;

const justifyContentOptions: FieldOption<LayoutJustifyContent>[] = [
  { label: 'Left', value: 'NORMAL', icon: { icon: IvyIcons.AlignLeft } },
  { label: 'Right', value: 'END', icon: { icon: IvyIcons.AlignRight } }
] as const;

const alignItemsOptions: FieldOption<LayoutAlignItems>[] = [
  { label: 'Top', value: 'START', icon: { icon: IvyIcons.AlignRight, rotate: 270 } },
  { label: 'Center', value: 'CENTER', icon: { icon: IvyIcons.AlignHorizontal, rotate: 180 } },
  { label: 'Bottom', value: 'END', icon: { icon: IvyIcons.AlignLeft, rotate: 270 } }
] as const;

export const defaultLayoutProps: LayoutProps = {
  components: [],
  type: 'GRID',
  alignItems: 'START',
  justifyContent: 'NORMAL',
  gridVariant: 'GRID2',
  ...defaultVisibleComponent,
  ...defaultBaseComponent
};

export const LayoutComponent: ComponentConfig<LayoutProps> = {
  name: 'Layout',
  category: 'Structures',
  subcategory: 'General',
  icon: <IconSvg />,
  description: 'A flexable layout',
  defaultProps: defaultLayoutProps,
  render: props => <UiBlock {...props} />,
  create: ({ defaultProps }) => ({ ...defaultLayoutProps, ...defaultProps }),
  outlineInfo: component => component.type,
  fields: {
    ...baseComponentFields,
    components: { subsection: 'General', type: 'hidden' },
    type: { subsection: 'General', label: 'Type', type: 'select', options: typeOptions },
    justifyContent: {
      subsection: 'General',
      type: 'toggleGroup',
      label: 'Horizontal Alignment',
      options: justifyContentOptions,
      hide: data => data.type !== 'FLEX'
    },

    gridVariant: {
      subsection: 'General',
      type: 'select',
      label: 'Columns',
      options: gridVariantOptions,
      hide: data => data.type !== 'GRID'
    },
    alignItems: {
      subsection: 'General',
      type: 'toggleGroup',
      label: 'Vertical Alignment',
      options: alignItemsOptions,
      hide: data => data.type === 'GRID' && data.gridVariant === 'GRID1'
    },
    ...visibleComponentField
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({ id, components, type, justifyContent, gridVariant, visible, alignItems }: UiComponentProps<LayoutProps>) => {
  const { ui } = useAppContext();

  return (
    <>
      <UiBlockHeader visible={visible} />
      <div
        className={`block-layout${type === 'GRID' ? ' grid' : ' flex'}${justifyContent === 'END' ? ' justify-end' : ''} ${
          ' align-' + alignItems.toLocaleLowerCase()
        } ${`${gridVariant.toLocaleLowerCase()}`}`}
        data-responsive-mode={ui.deviceMode}
      >
        {components.map((component, index) => {
          let componentCols = '';
          if (gridVariant === 'FREE') {
            componentCols = `col-span-${component.config.lgSpan ?? '6'} col-md-span-${component.config.mdSpan ?? '12'}`;
          }
          return <ComponentBlock key={component.cid} component={component} preId={components[index - 1]?.cid} className={componentCols} />;
        })}
      </div>
      <EmptyLayoutBlock id={id} components={components} type='layout' />
    </>
  );
};
