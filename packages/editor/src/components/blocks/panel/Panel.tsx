import type { Panel, Prettify } from '@axonivy/form-editor-protocol';
import { baseComponentFields, defaultBaseComponent, defaultVisibleComponent, visibleComponentField } from '../base';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import IconSvg from './Panel.svg?react';
import { Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { STRUCTURE_DROPZONE_ID_PREFIX } from '../../../data/data';
import { EmtpyBlock } from '../../../editor/canvas/EmptyBlock';
import './Panel.css';
import { UiBlockHeaderVisiblePart } from '../../UiBlockHeader';

type PanelProps = Prettify<Panel>;

export const defaultPanelProps: PanelProps = {
  components: [],
  title: 'Title',
  collapsible: false,
  collapsed: false,
  ...defaultVisibleComponent,
  ...defaultBaseComponent
};

export const PanelComponent: ComponentConfig<PanelProps> = {
  name: 'Panel',
  category: 'Structure',
  subcategory: 'General',
  icon: <IconSvg />,
  description: 'A group of components',
  defaultProps: defaultPanelProps,
  quickActions: DEFAULT_QUICK_ACTIONS,
  render: props => <UiBlock {...props} />,
  create: ({ defaultProps }) => ({ ...defaultPanelProps, ...defaultProps }),
  outlineInfo: component => component.title,
  fields: {
    components: { subsection: 'General', type: 'hidden' },
    title: { subsection: 'General', label: 'Title', type: 'textBrowser', browsers: ['ATTRIBUTE', 'CMS'] },
    collapsible: { subsection: 'Behaviour', label: 'Collapsible', type: 'checkbox' },
    collapsed: { subsection: 'Behaviour', label: 'Default collapsed', type: 'checkbox' },
    ...visibleComponentField,
    ...baseComponentFields
  }
};

const UiBlock = ({ id, components, title, collapsible, visible }: UiComponentProps<PanelProps>) => (
  <div className='i-panel'>
    <div className='i-panel-header'>
      {title}
      <Flex gap={1} alignItems='center'>
        <UiBlockHeaderVisiblePart visible={visible} />
        <IvyIcon icon={IvyIcons.Plus} className={`${collapsible ? '' : 'i-panel-non-collapsible'}`} />
      </Flex>
    </div>
    {components.map((component, index) => (
      <ComponentBlock key={component.id} component={component} preId={components[index - 1]?.id} />
    ))}
    <EmtpyBlock
      id={`${STRUCTURE_DROPZONE_ID_PREFIX}${id}`}
      preId={components[components.length - 1]?.id}
      forLayout={true}
      dragHint={{ display: components.length === 0, message: 'Drag first element inside the panel', mode: 'row' }}
    />
  </div>
);
