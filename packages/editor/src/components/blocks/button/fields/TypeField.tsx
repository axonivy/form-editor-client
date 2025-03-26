import { isButton, type ButtonType } from '@axonivy/form-editor-protocol';
import { SelectField } from '../../../../editor/sidebar/fields/SelectField';
import type { FieldOption, GenericFieldProps } from '../../../../types/config';
import { isEditableTable, useData } from '../../../../data/data';
import { useValidation } from '../../../../context/useValidation';

export const renderTypeField = (props: GenericFieldProps) => {
  return <TypeField {...props} />;
};

const TypeField = ({ label, value, onChange, validationPath }: GenericFieldProps) => {
  const { setElement, element, data } = useData();
  const message = useValidation(validationPath);
  if (!isEditableTable(data.components, element)) {
    return null;
  }

  const typeOptions: FieldOption<ButtonType>[] = [
    { label: 'Edit', value: 'EDIT' },
    { label: 'Delete', value: 'DELETE' },
    { label: 'Generic', value: 'BUTTON' }
  ];

  const updateValueAndAction = (change: string) => {
    onChange(change);
    setElement(element => {
      if (isButton(element)) {
        if (change === 'EDIT') {
          element.config.action = '#{ivyFormGenericRow.editRow(row)}';
          element.config.variant = 'PRIMARY';
          element.config.name = '';
          element.config.icon = 'pi pi-pencil';
        } else if (change === 'DELETE') {
          element.config.action = '#{ivyFormGenericRow.deleteRow(row)}';
          element.config.variant = 'DANGER';
          element.config.name = '';
          element.config.icon = 'pi pi-trash';
        }
      }
      return element;
    });
  };

  return <SelectField label={label} options={typeOptions} value={value as string} onChange={updateValueAndAction} message={message} />;
};
