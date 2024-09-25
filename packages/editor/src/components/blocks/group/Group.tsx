import type { Group, GroupStyle, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import IconSvg from './Group.svg?react';
import { defaultBaseComponent, baseComponentFields } from '../base';
import { EmtpyBlock } from '../../../editor/canvas/EmptyBlock';
import { STRUCTURE_DROPZONE_ID_PREFIX } from '../../../data/data';
import './Group.css';
import { IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

type GroupProps = Prettify<Group>;

export const defaultGroupProps: GroupProps = {
  components: [],
  legend: 'Title',
  disabled: false,
  collapsible: false,
  collapsed: false,
  style: 'FIELDSET',
  ...defaultBaseComponent
};

const styleOptions: FieldOption<GroupStyle>[] = [
  { label: 'Fieldset', value: 'FIELDSET' },
  { label: 'Card', value: 'CARD' }
];

export const GroupComponent: ComponentConfig<GroupProps> = {
  name: 'Group',
  category: 'Structure',
  subcategory: 'General',
  icon: <IconSvg />,
  description: 'A group of inputs',
  defaultProps: defaultGroupProps,
  quickActions: DEFAULT_QUICK_ACTIONS,
  render: props => <UiBlock {...props} />,
  create: ({ defaultProps }) => ({ ...defaultGroupProps, ...defaultProps }),
  outlineInfo: component => component.legend,
  fields: {
    components: { subsection: 'General', type: 'hidden' },
    legend: { subsection: 'General', label: 'Title', type: 'textBrowser', browsers: ['ATTRIBUTE'] },
    style: { subsection: 'General', label: 'Style', type: 'select', options: styleOptions },
    collapsible: { subsection: 'Behaviour', label: 'Collapsible', type: 'checkbox' },
    collapsed: { subsection: 'Behaviour', label: 'Default collapsed', type: 'checkbox' },
    disabled: { subsection: 'Behaviour', label: 'read-only', type: 'hidden' },
    ...baseComponentFields
  }
};

const UiBlock = ({ id, components, legend, collapsible, disabled, style }: UiComponentProps<GroupProps>) => {
  const content = (
    <>
      {components.map((component, index) => (
        <ComponentBlock key={component.id} component={component} preId={components[index - 1]?.id} />
      ))}
      <EmtpyBlock
        id={`${STRUCTURE_DROPZONE_ID_PREFIX}${id}`}
        preId={components[components.length - 1]?.id}
        forLayout={true}
        dragHint={{ display: components.length === 0, message: 'Drag first element inside the fieldset', mode: 'row' }}
      />
    </>
  );

  if (style === 'CARD') {
    return (
      <div className='group group-flex group-border'>
        <div className='card-header group-flex'>
          <h3 className='card-title'>{legend}</h3>
          <IvyIcon icon={IvyIcons.Chevron} className={`${collapsible ? '' : 'card-non-collapsible'}`} />
        </div>
        {content}
      </div>
    );
  }
  return (
    <fieldset className={`group ${collapsible ? 'collapsible' : ''} group-border group-flex`} disabled={disabled}>
      <legend className='group-border'>{legend}</legend>
      {content}
    </fieldset>
  );
};
