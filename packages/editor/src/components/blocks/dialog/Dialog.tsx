import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { isTable, type Dialog, type Prettify } from '@axonivy/form-editor-protocol';
import { defaultBaseComponent, baseComponentFields } from '../base';
import IconSvg from './Dialog.svg?react';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { EmptyLayoutBlock } from '../../../editor/canvas/EmptyBlock';
import { UiBadge } from '../../UiBlockHeader';
import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../../context/AppContext';
import { findComponentDeep } from '../../../data/data';
import { DataClassDialog } from '../../../editor/browser/data-class/DataClassDialog';
import { stripELExpression } from '../../../utils/string';
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
  const { data } = useAppContext();
  const dataTable = findComponentDeep(data.components, linkedComponent);
  const table = dataTable ? dataTable.data[dataTable.index] : undefined;
  const onlyAttributs = table && isTable(table) ? stripELExpression(table.config.value) : undefined;

  return (
    <>
      <Flex direction='row' justifyContent='space-between' alignItems='center'>
        <UiBadge value={header} />
        <DataClassDialog
          showWorkflowButtonsCheckbox={false}
          creationTarget={id}
          onlyAttributs={onlyAttributs}
          showRootNode={false}
          prefix='genericRowManager.selectedRow'
        >
          <Button
            icon={IvyIcons.DatabaseLink}
            size='small'
            aria-label={`Create from ${linkedComponent}`}
            title={`Create from ${linkedComponent}`}
            onClick={e => {
              e.stopPropagation();
            }}
          />
        </DataClassDialog>
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
