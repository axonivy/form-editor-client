import type { Link, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Link.css';
import { baseComponentFields, defaultBaseComponent, defaultVisibleComponent, visibleComponentField } from '../base';
import IconSvg from './Link.svg?react';
import { UiBlockHeader } from '../../UiBlockHeader';

type LinkProps = Prettify<Link>;

export const defaultLinkProps: LinkProps = {
  name: 'link',
  href: '',
  ...defaultVisibleComponent,
  ...defaultBaseComponent
} as const;

export const LinkComponent: ComponentConfig<LinkProps> = {
  name: 'Link',
  category: 'Actions',
  subcategory: 'General',
  icon: <IconSvg />,
  description: 'Link to somewhere',
  defaultProps: defaultLinkProps,
  render: props => <UiBlock {...props} />,
  create: () => defaultLinkProps,
  outlineInfo: component => component.name,
  fields: {
    ...baseComponentFields,
    name: { subsection: 'General', label: 'Name', type: 'textBrowser', browsers: ['CMS'] },
    href: { subsection: 'General', label: 'Href', type: 'text' },
    ...visibleComponentField
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({ name, visible, ...props }: UiComponentProps<LinkProps>) => (
  <>
    <UiBlockHeader visible={visible} />
    <a className='block-link' {...props}>
      {name}
    </a>
  </>
);
