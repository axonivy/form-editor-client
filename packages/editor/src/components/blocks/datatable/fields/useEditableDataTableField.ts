import { isTable, type ButtonType, type ComponentData, type DataTable, type TableComponent } from '@axonivy/form-editor-protocol';
import { COLUMN_DROPZONE_ID_PREFIX, modifyData, TABLE_DROPZONE_ID_PREFIX, useData } from '../../../../data/data';
import { getRowType } from './ListOfObjectsField';
import type { CreateComponentData } from '../../../../types/config';
import { stripELExpression } from '../../../../utils/string';
import { useAppContext } from '../../../../context/AppContext';
import { useMeta } from '../../../../context/useMeta';
import { useTranslation } from 'react-i18next';
import { useSharedComponents } from '../../../../context/ComponentsContext';

export const useEditableDataTableField = () => {
  const { element, setData, setElement } = useData();
  const { context } = useAppContext();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const { componentByName } = useSharedComponents();
  const { t } = useTranslation();

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
          const data = modifyData(
            updatedData,
            {
              type: 'add',
              data: {
                componentName: create.componentName,
                create,
                targetId: create.componentName === 'Button' ? COLUMN_DROPZONE_ID_PREFIX + actionColumnId : create.targetId
              }
            },
            componentByName
          );
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
          element.config.addButton = true;
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
          return modifyData(
            updatedData,
            {
              type: 'remove',
              data: { id: id }
            },
            componentByName
          ).newData;
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

  const createComponentData: (element: ComponentData) => CreateComponentData[] = element => [
    {
      componentName: 'Dialog',
      targetId: 'canvas',
      label: t('property.editRow'),
      value: stripELExpression(isTable(element) ? element.config.value : ''),
      defaultProps: {
        linkedComponent: element.cid
      }
    },
    {
      componentName: 'DataTableColumn',
      targetId: TABLE_DROPZONE_ID_PREFIX + element.cid,
      label: t('property.actions'),
      value: '',
      defaultProps: {
        asActionColumn: true
      }
    },
    {
      componentName: 'Button',
      label: '',
      value: '#{ivyFormGenericRow.editRow(row)}',
      defaultProps: { type: 'EDIT', icon: 'pi pi-pencil', variant: 'PRIMARY' }
    },
    {
      componentName: 'Button',
      label: '',
      value: `#{ivyFormGenericRow.deleteRow(${stripELExpression(isTable(element) ? element.config.value : '')}, row)}`,
      defaultProps: { type: 'DELETE', icon: 'pi pi-trash', variant: 'DANGER' }
    }
  ];

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

  return { createEditComponents, deleteEditComponents };
};
