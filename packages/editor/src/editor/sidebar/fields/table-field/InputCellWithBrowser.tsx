import { type CellContext } from '@tanstack/react-table';
import { useEditCell, type InputProps } from '@axonivy/ui-components';
import './TableField.css';
import { InputFieldWithBrowser } from '../InputFieldWithBrowser';

type InputCellProps<TData> = InputProps & {
  cell: CellContext<TData, string>;
};

export const InputCellWithBrowser = <TData,>({ cell }: InputCellProps<TData>) => {
  const { value, setValue, onBlur } = useEditCell(cell);

  return <InputFieldWithBrowser label='' onChange={setValue} value={value} onBlur={onBlur} browsers={['ATTRIBUTE', 'CMS']} />;
};
