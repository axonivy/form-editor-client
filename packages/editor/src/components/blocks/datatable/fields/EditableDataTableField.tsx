import { Checkbox, Field, Label } from '@axonivy/ui-components';
import type { GenericFieldProps } from '../../../../types/config';
import { useEditableDataTableField } from './useEditableDataTableField';

export const renderEditableDataTableField = (props: GenericFieldProps) => {
  return <EditableDataTableField {...props} />;
};

export const EditableDataTableField = ({ label, value, onChange }: GenericFieldProps) => {
  const { createEditComponents, deleteEditComponents } = useEditableDataTableField();

  return (
    <Field direction='row' alignItems='center' gap={1}>
      <Checkbox
        checked={value as boolean}
        onCheckedChange={e => {
          if (e === true) {
            createEditComponents();
          } else {
            deleteEditComponents();
          }
          onChange(Boolean(e));
        }}
      />
      <Label>{label}</Label>
    </Field>
  );
};
