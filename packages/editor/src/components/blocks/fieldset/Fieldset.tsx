import type { Fieldset, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import IconSvg from './Fieldset.svg?react';
import { defaultBaseComponent, baseComponentFields } from '../base';
import { EmtpyBlock } from '../../../editor/canvas/EmptyBlock';
import { STRUCTURE_DROPZONE_ID_PREFIX } from '../../../data/data';
import './Fieldset.css';

type FieldsetProps = Prettify<Fieldset>;

export const defaultFieldsetProps: FieldsetProps = {
  components: [],
  legend: 'Title',
  disabled: false,
  collapsible: false,
  collapsed: false,
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
    collapsed: { subsection: 'Behaviour', label: 'Default collapsed', type: 'checkbox' },
    disabled: { subsection: 'Behaviour', label: 'read-only', type: 'hidden' },
    ...baseComponentFields
  }
};

const UiBlock = ({ id, components, legend, collapsible, disabled }: UiComponentProps<FieldsetProps>) => (
  <fieldset className={`${collapsible ? 'collapsible' : ''}`} disabled={disabled}>
    <legend>{legend}</legend>
    {components.map((component, index) => (
      <ComponentBlock key={component.id} component={component} preId={components[index - 1]?.id} />
    ))}
    <EmtpyBlock
      id={`${STRUCTURE_DROPZONE_ID_PREFIX}${id}`}
      preId={components[components.length - 1]?.id}
      forLayout={true}
      dragHint={{ display: components.length === 0, message: 'Drag first element inside the fieldset', mode: 'row' }}
    />
  </fieldset>
);
