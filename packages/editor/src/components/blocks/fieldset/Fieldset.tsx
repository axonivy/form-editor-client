import type { Fieldset, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import IconSvg from './Fieldset.svg?react';
import { defaultBaseComponent, baseComponentFields, defaultVisibleComponent, visibleComponentField } from '../base';
import { EmtpyBlock } from '../../../editor/canvas/EmptyBlock';
import { STRUCTURE_DROPZONE_ID_PREFIX } from '../../../data/data';
import './Fieldset.css';
import { UiBlockHeader } from '../../UiBlockHeader';

type FieldsetProps = Prettify<Fieldset>;

export const defaultFieldsetProps: FieldsetProps = {
  components: [],
  legend: 'Title',
  collapsible: false,
  collapsed: false,
  ...defaultVisibleComponent,
  ...defaultBaseComponent
};

export const FieldsetComponent: ComponentConfig<FieldsetProps> = {
  name: 'Fieldset',
  category: 'Structure',
  subcategory: 'General',
  icon: <IconSvg />,
  description: 'A group of inputs',
  defaultProps: defaultFieldsetProps,
  quickActions: DEFAULT_QUICK_ACTIONS,
  render: props => <UiBlock {...props} />,
  create: ({ defaultProps }) => ({ ...defaultFieldsetProps, ...defaultProps }),
  outlineInfo: component => component.legend,
  fields: {
    components: { subsection: 'General', type: 'hidden' },
    legend: { subsection: 'General', label: 'Title', type: 'textBrowser', browsers: ['ATTRIBUTE', 'CMS'] },
    collapsible: { subsection: 'Behaviour', label: 'Collapsible', type: 'checkbox' },
    collapsed: { subsection: 'Behaviour', label: 'Collapsed by default', type: 'checkbox', hide: data => !data.collapsible },
    ...visibleComponentField,
    ...baseComponentFields
  }
};

const UiBlock = ({ id, components, legend, collapsible, collapsed, visible }: UiComponentProps<FieldsetProps>) => (
  <>
    <UiBlockHeader visible={visible} />
    <fieldset className={`${collapsible ? (collapsed ? 'collapsible default-collapsed' : 'collapsible') : ''}`}>
      <legend>
        {collapsible ? (collapsed ? '+ ' : '- ') : ''}
        {legend}
      </legend>
      {components.map((component, index) => (
        <ComponentBlock key={component.cid} component={component} preId={components[index - 1]?.cid} />
      ))}
      <EmtpyBlock
        id={`${STRUCTURE_DROPZONE_ID_PREFIX}${id}`}
        preId={components[components.length - 1]?.cid}
        forLayout={true}
        dragHint={{ display: components.length === 0, message: 'Drag first element inside the fieldset', mode: 'row' }}
      />
    </fieldset>
  </>
);
