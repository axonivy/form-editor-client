import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import './Layout.css';
import type { Layout, Prettify } from '@axonivy/form-editor-protocol';
import { config } from '../../components';
import { ComponentBlock, EmtpyBlock } from '../../editor/canvas/Canvas';
import { LAYOUT_DROPZONE_ID_PREFIX } from '../../../data/data';

type LayoutProps = Prettify<Layout>;

export const defaultFlexProps: LayoutProps = {
  components: []
};

export const LayoutComponent: ComponentConfig<LayoutProps> = {
  name: 'Layout',
  category: 'Layout',
  icon: 'M2 20h8V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM13 20h8V4h-8v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1Z',
  description: 'A flexable layout',
  defaultProps: defaultFlexProps,
  render: props => <LayoutBlock {...props} />,
  fields: {
    components: { type: 'hidden' }
  }
};

const LayoutBlock = ({ id, components }: UiComponentProps<LayoutProps>) => {
  return (
    <div className='block-flex'>
      {components.map((component, index) => {
        return <ComponentBlock key={component.id} component={component} config={config} preId={components[index - 1]?.id} />;
      })}
      <EmtpyBlock id={`${LAYOUT_DROPZONE_ID_PREFIX}${id}`} preId={components[components.length - 1]?.id} />
    </div>
  );
};
