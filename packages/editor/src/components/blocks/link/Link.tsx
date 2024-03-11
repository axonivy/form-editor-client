import type { Link, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import './Link.css';
import { baseComponentFields, defaultBaseComponent } from '../base';

type LinkProps = Prettify<Link>;

export const defaultLinkProps: LinkProps = {
  name: 'link',
  href: '',
  ...defaultBaseComponent
} as const;

export const LinkComponent: ComponentConfig<LinkProps> = {
  name: 'Link',
  category: 'Basic',
  icon: 'M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z',
  description: 'Link to somewhere',
  defaultProps: defaultLinkProps,
  render: props => <LinkBlock {...props} />,
  fields: {
    name: { type: 'text' },
    href: { type: 'text' },
    ...baseComponentFields
  }
};

const LinkBlock = ({ name, ...props }: UiComponentProps<LinkProps>) => (
  <a className='block-link' {...props}>
    {name}
  </a>
);
