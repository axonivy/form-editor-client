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
    ...baseComponentFields,
    components: { subsection: 'General', type: 'hidden' },
    title: { subsection: 'General', label: 'Title', type: 'textBrowser', browsers: ['ATTRIBUTE', 'CMS'] },
    collapsible: { subsection: 'Behaviour', label: 'Collapsible', type: 'checkbox' },
    collapsed: { subsection: 'Behaviour', label: 'Collapsed by default', type: 'checkbox', options: {}, hide: data => !data.collapsible },
    ...visibleComponentField
  }
};

const UiBlock = ({ id, components, title, collapsible, collapsed, visible }: UiComponentProps<PanelProps>) => (
  <div className={`i-panel ${collapsible && collapsed ? 'default-collapsed' : ''}`}>
    <div className='i-panel-header'>
      {title}
      <Flex gap={1} alignItems='center'>
        <UiBlockHeaderVisiblePart visible={visible} />
        {collapsible ? (
          collapsed ? (
            <IvyIcon icon={IvyIcons.Plus} className={`${collapsible ? '' : 'i-panel-non-collapsible'}`} />
          ) : (
            <svg width='12' height='1.3' viewBox='0 0 13 2' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M1 1L12 1' stroke='#4a4a4a' strokeWidth='1.13' strokeLinecap='round' />
            </svg>
          )
        ) : null}
      </Flex>
    </div>
    {components.map((component, index) => (
      <ComponentBlock key={component.cid} component={component} preId={components[index - 1]?.cid} />
    ))}
    <EmtpyBlock
      id={`${STRUCTURE_DROPZONE_ID_PREFIX}${id}`}
      preId={components[components.length - 1]?.cid}
      forLayout={true}
      dragHint={{ display: components.length === 0, message: 'Drag first element inside the panel', mode: 'row' }}
    />
  </div>
);
