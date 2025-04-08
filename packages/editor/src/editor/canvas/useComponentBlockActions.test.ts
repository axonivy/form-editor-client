import { customRenderHook } from 'test-utils';
import { useComponentBlockActions } from './useComponentBlockActions';
import { renderHook, waitFor } from '@testing-library/react';
import type { Component, FormData } from '@axonivy/form-editor-protocol';
import { useDataTableComponent } from '../../components/blocks/datatable/DataTable';
import type { ComponentConfig } from '../../types/config';
import { useComponentsInit } from '../../components/components';

const data = {
  id: 'a5c1d16e-1d08-4e1f-a9f0-436c553a3881',
  config: {
    renderer: 'JSF',
    theme: 'freya-ivy'
  },
  components: [
    {
      cid: 'datatable1',
      type: 'DataTable',
      config: {
        components: [],
        value: '#{data.persons}',
        rowType: 'form.test.project.Person',
        isEditable: false,
        editDialogId: 'dialog3'
      }
    },
    {
      cid: 'dialog3',
      config: {
        components: [],
        header: 'Edit Row',
        id: '',
        lgSpan: '6',
        linkedComponent: 'datatable1',
        mdSpan: '12',
        onApply: 'data.persons'
      },
      type: 'Dialog'
    }
  ]
} as FormData;

test('delete datatable also deletes dialog', async () => {
  const newData = [] as FormData[];
  const compData = { cid: 'datatable1', config: { editDialogId: 'dialog3' } } as Component;
  const { result: componentsHook } = renderHook(() => useComponentsInit());
  const { componentByName } = componentsHook.current;

  const { result: dataTableHook } = renderHook(() => useDataTableComponent(componentByName));
  const { DataTableComponent } = dataTableHook.current;

  const view = customRenderHook(
    () => useComponentBlockActions({ config: DataTableComponent as unknown as ComponentConfig, data: compData }),
    {
      wrapperProps: {
        appContext: { data: data, setData: data => newData.push(data), selectedElement: 'datatable1' }
      }
    }
  );
  await waitFor(() => expect(view.result.current).toBeDefined());
  expect(data.components.length).toBe(2);
  view.result.current.deleteElement();

  expect(newData[0].components.length).toBe(1);
  expect(newData[0].components[0].cid).toBe('dialog3');
  expect(newData[1].components.length).toBe(1);
  expect(newData[1].components[0].cid).toBe('datatable1');
});
