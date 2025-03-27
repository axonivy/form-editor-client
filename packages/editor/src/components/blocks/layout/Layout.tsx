import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import './Layout.css';
import type { Layout, LayoutGridVariant, LayoutJustifyContent, LayoutType, Prettify } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../context/AppContext';
import { useBase } from '../base';
import IconSvg from './Layout.svg?react';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { EmptyLayoutBlock } from '../../../editor/canvas/EmptyBlock';
import { UiBlockHeader } from '../../UiBlockHeader';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type LayoutProps = Prettify<Layout>;

export const useLayoutComponent = () => {
  const { defaultBaseComponent, baseComponentFields, defaultVisibleComponent, visibleComponentField } = useBase();
  const { t } = useTranslation();

  const LayoutComponent = useMemo(() => {
    const typeOptions: FieldOption<LayoutType>[] = [
      { label: t('layout.grid'), value: 'GRID' },
      { label: t('layout.flex'), value: 'FLEX' }
    ] as const;

    const gridVariantOptions: FieldOption<LayoutGridVariant>[] = [
      { label: t('layout.column', { count: 1 }), value: 'GRID1' },
      { label: t('layout.column', { count: 2 }), value: 'GRID2' },
      { label: t('layout.column', { count: 4 }), value: 'GRID4' },
      { label: t('layout.free'), value: 'FREE' }
    ] as const;

    const justifyContentOptions: FieldOption<LayoutJustifyContent>[] = [
      { label: t('layout.left'), value: 'NORMAL', icon: { icon: IvyIcons.AlignLeft } },
      { label: t('layout.spaceBetween'), value: 'SPACE_BETWEEN', icon: { icon: IvyIcons.Straighten } },
      { label: t('layout.right'), value: 'END', icon: { icon: IvyIcons.AlignRight } }
    ] as const;

    const defaultLayoutProps: LayoutProps = {
      components: [],
      type: 'GRID',
      justifyContent: 'NORMAL',
      gridVariant: 'GRID2',
      ...defaultVisibleComponent,
      ...defaultBaseComponent
    };

    const LayoutComponent: ComponentConfig<LayoutProps> = {
      name: 'Layout',
      displayName: t('layout.name'),
      category: 'Structures',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('layout.description'),
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
          label: t('property.horizontalAlignment'),
          options: justifyContentOptions,
          hide: data => data.type !== 'FLEX'
        },

        gridVariant: {
          subsection: 'General',
          type: 'select',
          label: t('property.columns'),
          options: gridVariantOptions,
          hide: data => data.type !== 'GRID'
        },
        ...visibleComponentField
      },
      quickActions: [...DEFAULT_QUICK_ACTIONS, 'EXTRACTINTOCOMPONENT']
    };

    return LayoutComponent;
  }, [baseComponentFields, defaultBaseComponent, defaultVisibleComponent, t, visibleComponentField]);

  return {
    LayoutComponent
  };
};

const UiBlock = ({ id, components, type, justifyContent, gridVariant, visible }: UiComponentProps<LayoutProps>) => {
  const { ui } = useAppContext();

  return (
    <>
      <UiBlockHeader visible={visible} />
      <div
        className={`block-layout${type === 'GRID' ? ' grid' : ' flex'}${justifyContent === 'END' ? ' justify-end' : justifyContent === 'SPACE_BETWEEN' ? ' justify-space_between' : ''} ${`${gridVariant.toLocaleLowerCase()}`}`}
        data-responsive-mode={ui.deviceMode}
      >
        {components.map((component, index) => {
          let componentCols = '';
          if (gridVariant === 'FREE') {
            componentCols = `col-span-${component.config.lgSpan ?? '6'} col-md-span-${component.config.mdSpan ?? '12'}`;
          }
          let componentAlignSelf = '';
          if (!(gridVariant === 'GRID1' && type === 'GRID')) {
            componentAlignSelf = getAlignSelfClass(component.config.alignSelf);
          }
          return (
            <ComponentBlock
              key={component.cid}
              component={component}
              preId={components[index - 1]?.cid}
              className={`${componentCols} ${componentAlignSelf}`}
            />
          );
        })}
      </div>
      <EmptyLayoutBlock id={id} components={components} type='layout' />
    </>
  );
};

const getAlignSelfClass = (alignSelf?: string) => {
  if (alignSelf === 'END') return 'align-self-end';
  if (alignSelf === 'CENTER') return 'align-self-center';
  return '';
};
