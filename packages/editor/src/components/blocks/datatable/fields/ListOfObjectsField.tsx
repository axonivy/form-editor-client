import type { GenericFieldProps } from '../../../../types/config';
import { useData } from '../../../../data/data';
import { isTable, type VariableInfo } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../../context/AppContext';
import { useMeta } from '../../../../context/useMeta';
import { InputFieldWithBrowser } from '../../../../editor/sidebar/fields/InputFieldWithBrowser';
import { findAttributesOfType } from '../../../../editor/browser/data-class/variable-tree-data';
import { useValidation } from '../../../../context/useValidation';

export const renderListOfObjectsField = (props: GenericFieldProps) => {
  return <ListOfObjectsField {...props} />;
};

const ListOfObjectsField = ({ label, value, onChange, validationPath }: GenericFieldProps) => {
  const { setElement } = useData();
  const { context } = useAppContext();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const message = useValidation(validationPath);

  const updateValueAndRowType = (change: string) => {
    onChange(change);
    setElement(element => {
      if (isTable(element)) {
        element.config.rowType = getRowType(change, variableInfo);
      }
      return element;
    });
  };

  return (
    <InputFieldWithBrowser
      label={label}
      browsers={[{ type: 'ATTRIBUTE', options: { typeHint: 'List' } }]}
      value={value as string}
      onChange={updateValueAndRowType}
      message={message}
    />
  );
};

export const getRowType = (value: string, variableInfo: VariableInfo) => {
  const tree = findAttributesOfType(variableInfo, value);
  if (tree.length > 0) {
    return tree[0].info;
  }
  return '';
};
