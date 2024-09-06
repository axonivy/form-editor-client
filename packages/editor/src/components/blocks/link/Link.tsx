import type { Link, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Link.css';
import { baseComponentFields, defaultBaseComponent } from '../base';
import IconSvg from './Link.svg?react';

type LinkProps = Prettify<Link>;

export const defaultLinkProps: LinkProps = {
  name: 'link',
  href: '',
  ...defaultBaseComponent
} as const;

export const LinkComponent: ComponentConfig<LinkProps> = {
  name: 'Link',
  category: 'Action',
  subcategory: 'General',
  icon: <IconSvg />,
  description: 'Link to somewhere',
  defaultProps: defaultLinkProps,
  render: props => <UiBlock {...props} />,
  create: () => defaultLinkProps,
  outlineInfo: component => component.name,
  fields: {
    name: { subsection: 'General', label: 'Name', type: 'text' },
    href: { subsection: 'General', label: 'Href', type: 'text' },
    ...baseComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({ name, ...props }: UiComponentProps<LinkProps>) => (
  <a className='block-link' {...props}>
    {name}
  </a>
);
