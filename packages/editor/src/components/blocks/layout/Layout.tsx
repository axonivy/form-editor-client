import { DropZone } from '../../editor/canvas/DropZone';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import './Layout.css';
import type { Layout, Prettify } from '@axonivy/form-editor-protocol';
import { config } from '../../components';
import { ComponentBlock } from '../../editor/canvas/Canvas';
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
      {[...components].map((component, index) => {
        return (
          <div className='flex-column' key={index}>
            <ComponentBlock component={component} config={config} />
          </div>
        );
      })}
      <div className='flex-column'>
        <DropZone id={`${LAYOUT_DROPZONE_ID_PREFIX}${id}`} visible={true} />
      </div>
    </div>
  );
};
