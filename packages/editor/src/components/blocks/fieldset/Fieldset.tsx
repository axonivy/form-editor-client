import type { Fieldset, GroupStyle, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import IconSvg from './Fieldset.svg?react';
import { defaultBaseComponent, baseComponentFields } from '../base';
import { EmtpyBlock } from '../../../editor/canvas/EmptyBlock';
import { STRUCTURE_DROPZONE_ID_PREFIX } from '../../../data/data';
import './Fieldset.css';
import { useState } from 'react';
import { IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

type FieldsetProps = Prettify<Fieldset>;

export const defaultFieldsetProps: FieldsetProps = {
  components: [],
  legend: 'Title',
  disabled: false,
  collapsible: false,
  collapsed: false,
  style: 'CARD',
  ...defaultBaseComponent
};

const styleOptions: FieldOption<GroupStyle>[] = [
  { label: 'Fieldset', value: 'FIELDSET' },
  { label: 'Card', value: 'CARD' }
];

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
    style: { subsection: 'General', label: 'Style', type: 'select', options: styleOptions },
    legend: { subsection: 'General', label: 'Title', type: 'textBrowser', browsers: ['ATTRIBUTE'] },
    collapsible: { subsection: 'Behaviour', label: 'Collapsible', type: 'checkbox' },
    collapsed: { subsection: 'Behaviour', label: 'Default collapsed', type: 'checkbox' },
    disabled: { subsection: 'Behaviour', label: 'read-only', type: 'hidden' },
    ...baseComponentFields
  }
};

const UiBlock = ({ id, components, legend, collapsible, disabled, style }: UiComponentProps<FieldsetProps>) => {
  enum State {
    open,
    close
  }
  const [cardState, setCardState] = useState(State[0]);
  const invertState = () => {
    if (cardState === 'open') {
      setCardState(State[1]);
    } else {
      setCardState(State[0]);
    }
  };

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
      <div className='card flex border'>
        <div className='card-header flex'>
          <h3 className='card-title' onClick={invertState}>
            {legend}
          </h3>
          <IvyIcon icon={IvyIcons.Chevron} />
        </div>

        <div className={`card-content card-${cardState}`}>{content}</div>
      </div>
    );
  }
  return (
    <fieldset className={`${collapsible ? 'collapsible' : ''} border flex`} disabled={disabled}>
      <legend className='border'>{legend}</legend>
      {content}
    </fieldset>
  );
};
