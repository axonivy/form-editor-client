import { act, renderHook } from '@testing-library/react';
import { useHistoryData } from './useHistoryData';
import { EMPTY_FORM, type FormData } from '@axonivy/form-editor-protocol';

const setData = vi.fn();
const history1: FormData = { ...EMPTY_FORM, components: [{ id: '1', type: 'Input', config: {} }] };
const history2: FormData = {
  ...EMPTY_FORM,
  components: [
    { id: '1', type: 'Input', config: {} },
    { id: '2', type: 'Text', config: {} }
  ]
};
const history3: FormData = { ...EMPTY_FORM, components: [{ id: '2', type: 'Text', config: {} }] };

beforeEach(() => {
  setData.mockImplementation(data => data());
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('undo', () => {
  const view = renderHistoryHook();
  pushHistory(view, history1);
  pushHistory(view, history2);
  pushHistory(view, history3);

  undo(view, true, true);
  expect(setData).toBeCalledTimes(1);
  expect(setData).toReturnWith(history2);

  undo(view, true, true);
  expect(setData).toBeCalledTimes(2);
  expect(setData).toReturnWith(history1);

  undo(view, false, true);
  expect(setData).toBeCalledTimes(3);
  expect(setData).toReturnWith(EMPTY_FORM);

  // further undos should not change the data
  undo(view, false, true);
  expect(setData).toBeCalledTimes(3);
});

test('undo with new push', () => {
  const view = renderHistoryHook();
  pushHistory(view, history1);
  pushHistory(view, history2);

  undo(view, true, true);
  expect(setData).toBeCalledTimes(1);
  expect(setData).toReturnWith(history1);

  pushHistory(view, history3);
  undo(view, true, true);
  expect(setData).toBeCalledTimes(2);
  expect(setData).toReturnWith(history1);
});

test('undo with new push', () => {
  const view = renderHistoryHook();
  pushHistory(view, history1);
  pushHistory(view, history2);
  pushHistory(view, history3);

  undo(view, true, true);
  undo(view, true, true);
  undo(view, false, true);

  redo(view, true, true);
  expect(setData).toBeCalledTimes(4);
  expect(setData).toReturnWith(history1);

  redo(view, true, true);
  expect(setData).toBeCalledTimes(5);
  expect(setData).toReturnWith(history2);

  redo(view, true, false);
  expect(setData).toBeCalledTimes(6);
  expect(setData).toReturnWith(history3);

  // further redos should not change the data
  redo(view, true, false);
  expect(setData).toBeCalledTimes(6);
});

const renderHistoryHook = () => {
  const view = renderHook(() => useHistoryData());
  act(() => view.result.current.pushHistory(EMPTY_FORM));
  view.rerender();
  expect(view.result.current.canUndo).toBeFalsy();
  expect(view.result.current.canRedo).toBeFalsy();
  return view;
};

const pushHistory = (view: ReturnType<typeof renderHistoryHook>, data: FormData) => {
  act(() => view.result.current.pushHistory(data));
  view.rerender();
  expect(view.result.current.canUndo).toBeTruthy();
  expect(view.result.current.canRedo).toBeFalsy();
};

const undo = (view: ReturnType<typeof renderHistoryHook>, canUndo: boolean, canRedo: boolean) => {
  act(() => view.result.current.undo(setData));
  view.rerender();
  expect(view.result.current.canUndo).toEqual(canUndo);
  expect(view.result.current.canRedo).toEqual(canRedo);
};

const redo = (view: ReturnType<typeof renderHistoryHook>, canUndo: boolean, canRedo: boolean) => {
  act(() => view.result.current.redo(setData));
  view.rerender();
  expect(view.result.current.canUndo).toEqual(canUndo);
  expect(view.result.current.canRedo).toEqual(canRedo);
};
