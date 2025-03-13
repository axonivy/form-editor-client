import { Checkbox, Field, Label } from '@axonivy/ui-components';
import type { CreateComponentData, GenericFieldProps } from '../../../../types/config';
import { COLUMN_DROPZONE_ID_PREFIX, modifyData, TABLE_DROPZONE_ID_PREFIX, useData } from '../../../../data/data';
import { isTable, type ButtonType, type ComponentData, type DataTable, type TableComponent } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../../context/AppContext';
import { useMeta } from '../../../../context/useMeta';
import { stripELExpression } from '../../../../utils/string';
import { getRowType } from './ListOfObjectsField';

export const renderEditableDataTableField = (props: GenericFieldProps) => {
  return <EditableDataTableField {...props} />;
};

const EditableDataTableField = ({ label, value, onChange }: GenericFieldProps) => {
  const { element, setData, setElement } = useData();
  const { context } = useAppContext();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;

  const createEditComponents = () => {
    if (isTable(element)) {
      const existingActionColumn = element.config.components.find(col => col.config.asActionColumn);
      let actionColumnId = existingActionColumn ? existingActionColumn.cid : '';
      let dialogId = '';

      setData(data => {
        return createComponentData(element).reduce((updatedData, create) => {
          if (existingActionColumn !== undefined && create.componentName === 'DataTableColumn') {
            return updatedData;
          }
          const data = modifyData(updatedData, {
            type: 'add',
            data: {
              componentName: create.componentName,
              create,
              targetId: create.componentName === 'Button' ? COLUMN_DROPZONE_ID_PREFIX + actionColumnId : create.targetId
            }
          });
          if (create.componentName === 'Dialog' && data.newComponentId) {
            dialogId = data.newComponentId;
          }
          if (create.componentName === 'DataTableColumn' && data.newComponentId && existingActionColumn === undefined) {
            actionColumnId = data.newComponentId;
          }
          return data.newData;
        }, data);
      });

      setElement(element => {
        if (isTable(element) && dialogId) {
          element.config.editDialogId = dialogId;
          element.config.rowType = getRowType(element.config.value, variableInfo);
        }
        return element;
      });
    }
  };

  const deleteEditComponents = () => {
    if (isTable(element)) {
      const editButton = findActionButtonId(element.config, 'EDIT');
      const deleteButton = findActionButtonId(element.config, 'DELETE');
      const deleteIds: string[] = [element.config.editDialogId, editButton?.buttonId, deleteButton?.buttonId].filter(
        (id): id is string => id !== undefined
      );
      setData(data => {
        return deleteIds.reduce((updatedData, id) => {
          return modifyData(updatedData, {
            type: 'remove',
            data: { id: id }
          }).newData;
        }, data);
      });

      setElement(element => {
        if (isTable(element)) {
          element.config.editDialogId = '';
        }
        return element;
      });
    }
  };

  const findActionButtonId = (table: DataTable, type: ButtonType): { buttonId: string; column: TableComponent } | undefined => {
    for (const column of table.components) {
      if (column.config.asActionColumn) {
        for (const button of column.config.components) {
          if (button.config.type === type) {
            return { buttonId: button.cid, column: column };
          }
        }
      }
    }
    return undefined;
  };
  return (
    <Field direction='row' alignItems='center' gap={1}>
      <Checkbox
        checked={value as boolean}
        onCheckedChange={e => {
          if (e === true) {
            createEditComponents();
          } else {
            deleteEditComponents();
          }
          onChange(Boolean(e));
        }}
      />
      <Label>{label}</Label>
    </Field>
  );
};

const createComponentData: (element: ComponentData) => CreateComponentData[] = element => [
  {
    componentName: 'Dialog',
    targetId: 'canvas',
    label: 'Edit Row',
    value: stripELExpression(isTable(element) ? element.config.value : ''),
    defaultProps: {
      linkedComponent: element.cid
    }
  },
  {
    componentName: 'DataTableColumn',
    targetId: TABLE_DROPZONE_ID_PREFIX + element.cid,
    label: 'Actions',
    value: '',
    defaultProps: {
      asActionColumn: true
    }
  },
  {
    componentName: 'Button',
    label: '',
    value: '#{genericRowManager.setSelectedRow(row)}',
    defaultProps: { type: 'EDIT', icon: 'pi pi-pencil', variant: 'PRIMARY' }
  },
  {
    componentName: 'Button',
    label: '',
    value: `#{genericRowManager.deleteRow(${stripELExpression(isTable(element) ? element.config.value : '')}, row)}`,
    defaultProps: { type: 'DELETE', icon: 'pi pi-trash', variant: 'DANGER' }
  }
];
