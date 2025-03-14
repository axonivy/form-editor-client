import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type CreateComponentData, type UiComponentProps } from '../../../types/config';
import { isTable, type Dialog, type Prettify, type Variable } from '@axonivy/form-editor-protocol';
import { defaultBaseComponent, baseComponentFields } from '../base';
import IconSvg from './Dialog.svg?react';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { EmptyLayoutBlock } from '../../../editor/canvas/EmptyBlock';
import { UiBadge } from '../../UiBlockHeader';
import { Button, Flex, labelText, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { findAttributesOfType, stripELExpression } from '../../../editor/browser/data-class/variable-tree-data';
import { componentForType } from '../../components';
import { findComponentDeep, modifyData, STRUCTURE_DROPZONE_ID_PREFIX } from '../../../data/data';
type DialogProps = Prettify<Dialog>;

export const defaultDialogProps: DialogProps = {
  components: [],
  header: '',
  linkedComponent: '',
  ...defaultBaseComponent
};

export const DialogComponent: ComponentConfig<DialogProps> = {
  name: 'Dialog',
  category: 'Hidden',
  subcategory: 'General',
  icon: <IconSvg />,
  description: 'A flexable layout',
  defaultProps: defaultDialogProps,
  render: props => <DialogUiBlock {...props} />,
  create: ({ label, value, defaultProps }) => ({ ...defaultDialogProps, header: label, onApply: value, ...defaultProps }),
  outlineInfo: component => component.header,
  fields: {
    ...baseComponentFields,
    components: { subsection: 'General', type: 'hidden' },
    header: {
      subsection: 'General',
      label: 'Header',
      type: 'textBrowser',
      browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
    },
    linkedComponent: { subsection: 'General', label: 'Linked Component', type: 'hidden' }
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

export const DialogUiBlock = ({ id, components, header, linkedComponent }: UiComponentProps<DialogProps>) => {
  const { context, setData, data } = useAppContext();
  const dataClass = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;

  const createFields = () => {
    const dataTable = findComponentDeep(data.components, linkedComponent);
    const table = dataTable ? dataTable.data[dataTable.index] : undefined;
    let tree: BrowserNode<Variable>[] = [];
    if (table && isTable(table)) {
      tree = findAttributesOfType(dataClass, stripELExpression(table.config.value));
    }

    const flattenTree = (nodes: BrowserNode<Variable>[]): BrowserNode<Variable>[] => {
      return nodes.flatMap(node => (node.children.length > 0 ? flattenTree(node.children) : node));
    };

    const leafNodes = flattenTree(tree);
    const createComponentData = leafNodes
      .map<CreateComponentData | undefined>(node => {
        const component = componentForType(node.info);
        if (component === undefined) {
          return undefined;
        }
        return {
          componentName: component.component.name,
          label: labelText(node.value),
          value: `#{genericRowManager.selectedRow${node.value.length === 0 || node.value === 'variable' ? '' : `.${node.value}`}}`,
          ...component.defaultProps
        };
      })
      .filter(create => create !== undefined);
    setData(data => {
      return createComponentData.reduce((updatedData, create) => {
        return modifyData(updatedData, {
          type: 'add',
          data: { componentName: create.componentName, create, targetId: STRUCTURE_DROPZONE_ID_PREFIX + id }
        }).newData;
      }, data);
    });
  };
  return (
    <>
      <Flex direction='row' justifyContent='space-between' alignItems='center'>
        <UiBadge value={header} />
        {components.length === 0 && (
          <Button icon={IvyIcons.DatabaseLink} variant='outline' onClick={createFields}>
            Create Fields from {linkedComponent}
          </Button>
        )}
      </Flex>
      {components.map((component, index) => {
        return <ComponentBlock key={component.cid} component={component} preId={components[index - 1]?.cid} />;
      })}

      <EmptyLayoutBlock id={id} components={components} type='dialog' />
      <Flex direction='row' justifyContent='flex-end' alignItems='center' gap={1}>
        <div className='block-button' data-variant={'secondary'}>
          <i className='pi pi-times' />
          Cancel
        </div>
        <div className='block-button' data-variant={'primary'}>
          <i className='pi pi-check' />
          Save
        </div>
      </Flex>
    </>
  );
};
