import { useAppContext } from '../../context/AppContext';
import type { Button, ComponentType, Composite, Layout } from '@axonivy/form-editor-protocol';
import { COLUMN_DROPZONE_ID_PREFIX, creationTargetId, modifyData, TABLE_DROPZONE_ID_PREFIX, useData } from '../../data/data';
import type { DraggableProps } from './ComponentBlock';
import { useComponents } from '../../context/ComponentsContext';
import { useFunction } from '../../context/useFunction';
import { toast, useReadonly } from '@axonivy/ui-components';
import { useQueryClient } from '@tanstack/react-query';
import { genQueryKey } from '../../query/query-client';
import { useAction } from '../../context/useAction';

export const useComponentBlockActions = ({ config, data }: DraggableProps) => {
  const { componentByName } = useComponents();
  const { setSelectedElement, context, setUi } = useAppContext();
  const readonly = useReadonly();
  const { setData } = useData();
  const queryClient = useQueryClient();
  const isDataTableEditableButtons =
    data.type === 'Button' && ((data.config as Button).type === 'EDIT' || (data.config as Button).type === 'DELETE');

  const elementConfig = { ...config.defaultProps, ...data.config };
  const deleteElement = () => {
    setData(oldData => modifyData(oldData, { type: 'remove', data: { id: data.cid } }, componentByName).newData);
    config.onDelete?.(elementConfig, setData);
    setSelectedElement(undefined);
  };

  const openComponent = useAction('openComponent');
  const duplicateElement = () => {
    setData(oldData => modifyData(oldData, { type: 'paste', data: { id: data.cid } }, componentByName).newData);
  };

  const createColumn = () => {
    setData(
      oldData =>
        modifyData(
          oldData,
          {
            type: 'add',
            data: {
              componentName: 'DataTableColumn',
              targetId: TABLE_DROPZONE_ID_PREFIX + data.cid
            }
          },
          componentByName
        ).newData
    );
  };

  const createActionColumn = () => {
    setData(
      oldData =>
        modifyData(
          oldData,
          {
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
          },
          componentByName
        ).newData
    );
  };

  const createActionButton = () => {
    setData(
      oldData =>
        modifyData(
          oldData,
          {
            type: 'add',
            data: { componentName: 'Button', targetId: COLUMN_DROPZONE_ID_PREFIX + data.cid }
          },
          componentByName
        ).newData
    );
  };

  const createElement = (name: ComponentType) => {
    setData(
      oldData =>
        modifyData(
          oldData,
          { type: 'add', data: { componentName: name, targetId: creationTargetId(oldData.components, data.cid) } },
          componentByName
        ).newData
    );
  };

  const extractIntoComponent = useFunction(
    'meta/composite/extractIntoComponent',
    {
      context,
      layoutId: data.cid,
      newComponentName: (data.config as Layout)?.id?.length > 0 ? (data.config as Layout).id : data.cid
    },
    {
      onSuccess: componentName => {
        toast.info('Ivy Component "' + componentName + '" was successfully created');
        queryClient.invalidateQueries({ queryKey: genQueryKey('data', context) });
      },
      onError: error => {
        toast.error('Failed to extract Component into own Ivy Component', {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: (error as any).data?.includes('already exists')
            ? 'Ivy Component ' + ((data.config as Layout).id.length > 0 ? (data.config as Layout).id : data.cid) + ' already exists'
            : error.message
        });
      }
    }
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      setSelectedElement(data.cid);
      setUi(old => ({ ...old, properties: true }));
    }
    if (readonly) return;
    if (e.key === 'Delete') {
      e.stopPropagation();
      deleteElement();
    }
    if (e.key === 'ArrowUp' && !isDataTableEditableButtons) {
      e.stopPropagation();
      setData(oldData => modifyData(oldData, { type: 'moveUp', data: { id: data.cid } }, componentByName).newData);
    }
    if (e.key === 'ArrowDown' && !isDataTableEditableButtons) {
      e.stopPropagation();
      setData(oldData => modifyData(oldData, { type: 'moveDown', data: { id: data.cid } }, componentByName).newData);
    }
    if (e.code === 'KeyM' && !isDataTableEditableButtons) {
      e.stopPropagation();
      duplicateElement();
    }
    if (e.code === 'KeyJ' && config.quickActions.find(q => q === 'OPENCOMPONENT')) {
      e.stopPropagation();
      openComponent((data.config as Composite).name);
    }
    if (e.code === 'KeyE' && config.quickActions.find(q => q === 'EXTRACTINTOCOMPONENT')) {
      e.stopPropagation();
      extractIntoComponent.mutate({
        context,
        layoutId: data.cid,
        newComponentName: (data.config as Layout).id.length > 0 ? (data.config as Layout).id : data.cid
      });
    }
  };
  return {
    deleteElement,
    duplicateElement,
    openComponent,
    onKeyDown,
    createColumn,
    createActionColumn,
    createActionButton,
    createElement,
    extractIntoComponent
  };
};
