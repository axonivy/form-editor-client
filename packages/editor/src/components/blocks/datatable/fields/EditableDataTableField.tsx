import { Checkbox, Field, Label } from '@axonivy/ui-components';
import type { GenericFieldProps } from '../../../../types/config';
import { COLUMN_DROPZONE_ID_PREFIX, modifyData, TABLE_DROPZONE_ID_PREFIX, useData } from '../../../../data/data';
import { isTable, type ActionButtonType, type DataTable, type TableComponent } from '@axonivy/form-editor-protocol';
import { getRowType } from '../../../../editor/sidebar/Properties';
import { useAppContext } from '../../../../context/AppContext';
import { useMeta } from '../../../../context/useMeta';

export const renderEditableDataTableField = (props: GenericFieldProps) => {
  return <EditableDataTableField {...props} />;
};

const EditableDataTableField = ({ label, value, onChange }: GenericFieldProps) => {
  const { element, setData, setElement } = useData();
  const { context } = useAppContext();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;

  const stripELExpression = (expr: string) => {
    return expr.replace(/^#\{|\}$/g, ''); // Remove #{ and }
  };

  const createEditDialog = () => {
    if (isTable(element)) {
      setData(oldData => {
        const dialog = modifyData(oldData, {
          type: 'add',
          data: {
            componentName: 'Dialog',
            targetId: element.cid,
            create: {
              label: 'Edit Row',
              value: stripELExpression(element.config.value),
              defaultProps: {
                linkedComponent: element.cid
              }
            }
          }
        });
        setElement(element => {
          if (isTable(element) && dialog.newComponentId) {
            element.config.editDialogId = dialog.newComponentId;
            element.config.rowType = getRowType(element.config.value, variableInfo);
          }
          return element;
        });

        const existingActionColumn = element.config.components.find(col => col.config.asActionColumn);
        let editActionColumn = existingActionColumn?.cid;
        let actionColumn = dialog;
        if (existingActionColumn === undefined) {
          actionColumn = modifyData(dialog.newData, {
            type: 'add',
            data: {
              componentName: 'DataTableColumn',
              targetId: TABLE_DROPZONE_ID_PREFIX + element.cid,
              create: {
                label: 'Actions',
                value: '',
                defaultProps: {
                  asActionColumn: true
                }
              }
            }
          });
          editActionColumn = actionColumn.newComponentId;
        }

        const actionEditButton = modifyData(actionColumn.newData, {
          type: 'add',
          data: {
            componentName: 'Button',
            targetId: COLUMN_DROPZONE_ID_PREFIX + editActionColumn,
            create: {
              label: '',
              value: '#{genericRowManager.setSelectedRow(row)}',
              defaultProps: { actionType: 'EDIT', icon: 'pi pi-pencil' }
            }
          }
        });

        const actionDeletetButton = modifyData(actionEditButton.newData, {
          type: 'add',
          data: {
            componentName: 'Button',
            targetId: COLUMN_DROPZONE_ID_PREFIX + editActionColumn,
            create: {
              label: '',
              value: `#{genericRowManager.deleteRow(${stripELExpression(element.config.value)}, row)}`,
              defaultProps: { actionType: 'DELETE', icon: 'pi pi-trash', variant: 'DANGER' }
            }
          }
        });

        return actionDeletetButton.newData;
      });
    }
  };

  const deleteEditDialog = () => {
    if (isTable(element)) {
      setData(oldData => {
        const noDialog = modifyData(oldData, {
          type: 'remove',
          data: {
            id: element.config.editDialogId
          }
        }).newData;
        setElement(element => {
          if (isTable(element)) {
            element.config.editDialogId = '';
          }
          return element;
        });
        const editButton = findActionButtonId(element.config, 'EDIT');
        let noEdit = noDialog;
        if (editButton) {
          noEdit = modifyData(noDialog, {
            type: 'remove',
            data: {
              id: editButton.buttonId
            }
          }).newData;
        }
        const deleteButton = findActionButtonId(element.config, 'DELETE');
        let noDelete = noEdit;
        if (deleteButton) {
          noDelete = modifyData(noDelete, {
            type: 'remove',
            data: {
              id: deleteButton.buttonId
            }
          }).newData;
        }
        return noDelete;
      });
    }
  };

  const findActionButtonId = (table: DataTable, type: ActionButtonType): { buttonId: string; column: TableComponent } | undefined => {
    for (const column of table.components) {
      if (column.config.asActionColumn) {
        for (const button of column.config.components) {
          if (button.config.actionType === type) {
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
            createEditDialog();
          } else {
            deleteEditDialog();
          }
          onChange(Boolean(e));
        }}
      />
      <Label>{label}</Label>
    </Field>
  );
};
