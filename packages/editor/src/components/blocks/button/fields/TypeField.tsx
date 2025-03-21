import { isButton, type ButtonType } from '@axonivy/form-editor-protocol';
import { SelectField } from '../../../../editor/sidebar/fields/SelectField';
import type { FieldOption, GenericFieldProps } from '../../../../types/config';
import { hasButtonInTable, isEditableTable, useData } from '../../../../data/data';
import { useValidation } from '../../../../context/useValidation';

export const renderTypeField = (props: GenericFieldProps) => {
  return <TypeField {...props} />;
};

const TypeField = ({ label, value, onChange, validationPath }: GenericFieldProps) => {
  const { setElement, element, data } = useData();
  const message = useValidation(validationPath);
  const editOption: FieldOption<ButtonType>[] =
    !hasButtonInTable(data.components, element, 'EDIT') || (isButton(element) && element.config.type === 'EDIT')
      ? [{ label: 'Edit', value: 'EDIT' }]
      : [];
  const deleteOption: FieldOption<ButtonType>[] =
    !hasButtonInTable(data.components, element, 'DELETE') || (isButton(element) && element.config.type === 'DELETE')
      ? [{ label: 'Delete', value: 'DELETE' }]
      : [];
  const typeOptions: FieldOption<ButtonType>[] = [...editOption, ...deleteOption, { label: 'Generic', value: 'BUTTON' }];

  const updateValueAndAction = (change: string) => {
    onChange(change);
    setElement(element => {
      if (isButton(element)) {
        if (change === 'EDIT') {
          element.config.action = '#{genericRowManager.editRow(row)}';
          element.config.variant = 'PRIMARY';
          element.config.name = '';
          element.config.icon = 'pi pi-pencil';
        } else if (change === 'DELETE') {
          element.config.action = '#{genericRowManager.deleteRow(row)}';
          element.config.variant = 'DANGER';
          element.config.name = '';
          element.config.icon = 'pi pi-trash';
        }
      }
      return element;
    });
  };

  return (
    isEditableTable(data.components, element) && (
      <SelectField label={label} options={typeOptions} value={value as string} onChange={updateValueAndAction} message={message} />
    )
  );
};
