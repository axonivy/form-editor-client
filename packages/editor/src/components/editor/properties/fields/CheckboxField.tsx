import { Checkbox, Flex, Label, useFieldset } from '@axonivy/ui-components';

type CheckboxFieldProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export const CheckboxField = ({ label, value, onChange }: CheckboxFieldProps) => {
  const fieldset = useFieldset();
  return (
    <Flex alignItems='center' gap={1}>
      <Checkbox checked={value} onCheckedChange={e => onChange(Boolean(e))} {...fieldset.inputProps} />
      <Label {...fieldset.labelProps}>{label}</Label>
    </Flex>
  );
};
