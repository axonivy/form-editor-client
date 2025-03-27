import type { Link, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Link.css';
import { useBase } from '../base';
import IconSvg from './Link.svg?react';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type LinkProps = Prettify<Link>;

export const useLinkComponent = () => {
  const { baseComponentFields, defaultBaseComponent, defaultVisibleComponent, visibleComponentField } = useBase();
  const { t } = useTranslation();

  const LinkComponent = useMemo(() => {
    const defaultLinkProps: LinkProps = {
      name: t('link.name'),
      href: '',
      ...defaultVisibleComponent,
      ...defaultBaseComponent
    } as const;

    const LinkComponent: ComponentConfig<LinkProps> = {
      name: 'Link',
      displayName: t('link.name'),
      category: 'Actions',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('link.description'),
      defaultProps: defaultLinkProps,
      render: props => <UiBlock {...props} />,
      create: () => defaultLinkProps,
      outlineInfo: component => component.name,
      fields: {
        ...baseComponentFields,
        name: {
          subsection: 'General',
          label: t('property.name'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
        },
        href: { subsection: 'General', label: t('property.href'), type: 'text' },
        ...visibleComponentField
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return LinkComponent;
  }, [baseComponentFields, defaultBaseComponent, defaultVisibleComponent, t, visibleComponentField]);

  return {
    LinkComponent
  };
};

const UiBlock = ({ name, visible, ...props }: UiComponentProps<LinkProps>) => (
  <>
    <UiBlockHeader visible={visible} />
    <p className='block-link' {...props}>
      <UiBadge value={name} />
    </p>
  </>
);
