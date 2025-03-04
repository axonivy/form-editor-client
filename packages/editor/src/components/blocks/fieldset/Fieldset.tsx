import type { Fieldset, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import IconSvg from './Fieldset.svg?react';
import { defaultBaseComponent, baseComponentFields, defaultVisibleComponent, visibleComponentField } from '../base';
import { EmptyLayoutBlock } from '../../../editor/canvas/EmptyBlock';
import './Fieldset.css';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { Flex } from '@axonivy/ui-components';

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
  category: 'Structures',
  subcategory: 'General',
  icon: <IconSvg />,
  description: 'A group of inputs',
  defaultProps: defaultFieldsetProps,
  quickActions: DEFAULT_QUICK_ACTIONS,
  render: props => <UiBlock {...props} />,
  create: ({ defaultProps }) => ({ ...defaultFieldsetProps, ...defaultProps }),
  outlineInfo: component => component.legend,
  fields: {
    ...baseComponentFields,
    components: { subsection: 'General', type: 'hidden' },
    legend: {
      subsection: 'General',
      label: 'Title',
      type: 'textBrowser',
      browsers: [
        { type: 'ATTRIBUTE', options: { overrideSelection: true } },
        { type: 'CMS', options: { overrideSelection: true } }
      ]
    },
    collapsible: { subsection: 'Behaviour', label: 'Collapsible', type: 'checkbox' },
    collapsed: { subsection: 'Behaviour', label: 'Collapsed by default', type: 'checkbox', hide: data => !data.collapsible },
    ...visibleComponentField
  }
};

const UiBlock = ({ id, components, legend, collapsible, collapsed, visible }: UiComponentProps<FieldsetProps>) => (
  <>
    <UiBlockHeader visible={visible} />
    <fieldset className={`${collapsible ? (collapsed ? 'collapsible default-collapsed' : 'collapsible') : ''}`}>
      <legend>
        <Flex direction='row' alignItems='center' gap={1}>
          {collapsible ? (collapsed ? '+' : '-') : ''}
          <UiBadge value={legend} />
        </Flex>
      </legend>
      {components.map((component, index) => (
        <ComponentBlock key={component.cid} component={component} preId={components[index - 1]?.cid} />
      ))}
      <EmptyLayoutBlock id={id} components={components} type='fieldset' />
    </fieldset>
  </>
);
