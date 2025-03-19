import { useAppContext } from '../../context/AppContext';
import type { ComponentType } from '@axonivy/form-editor-protocol';
import { COLUMN_DROPZONE_ID_PREFIX, creationTargetId, modifyData, TABLE_DROPZONE_ID_PREFIX, useData } from '../../data/data';
import type { DraggableProps } from './ComponentBlock';

export const useComponentBlockActions = ({ config, data }: DraggableProps) => {
  const { setSelectedElement } = useAppContext();
  const { setData } = useData();
  const elementConfig = { ...config.defaultProps, ...data.config };
  // console.log(config);
  // console.log(data);
  const deleteElement = () => {
    setData(oldData => modifyData(oldData, { type: 'remove', data: { id: data.cid } }).newData);
    config.onDelete?.(elementConfig, setData);
    setSelectedElement(undefined);
  };

  const duplicateElement = () => {
    setData(oldData => modifyData(oldData, { type: 'paste', data: { id: data.cid } }).newData);
  };

  const createColumn = () => {
    setData(
      oldData =>
        modifyData(oldData, {
          type: 'add',
          data: {
            componentName: 'DataTableColumn',
            targetId: TABLE_DROPZONE_ID_PREFIX + data.cid
          }
        }).newData
    );
  };

  const createActionColumn = () => {
    setData(
      oldData =>
        modifyData(oldData, {
          type: 'add',
          data: {
            componentName: 'DataTableColumn',
            targetId: TABLE_DROPZONE_ID_PREFIX + data.cid,
            create: {
              label: 'Actions',
              value: '',
              defaultProps: {
                asActionColumn: true
              }
            }
          }
        }).newData
    );
  };

  const createActionButton = () => {
    setData(
      oldData =>
        modifyData(oldData, {
          type: 'add',
          data: { componentName: 'Button', targetId: COLUMN_DROPZONE_ID_PREFIX + data.cid }
        }).newData
    );
  };

  const createElement = (name: ComponentType) => {
    setData(
      oldData =>
        modifyData(oldData, { type: 'add', data: { componentName: name, targetId: creationTargetId(oldData.components, data.cid) } })
          .newData
    );
  };
  return { deleteElement, duplicateElement, createColumn, createActionColumn, createActionButton, createElement };
};
