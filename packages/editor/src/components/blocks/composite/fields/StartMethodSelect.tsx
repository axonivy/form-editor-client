import { BasicField, BasicSelect } from '@axonivy/ui-components';
import type { GenericFieldProps } from '../../../../types/config';
import { useMeta } from '../../../../context/useMeta';
import { useAppContext } from '../../../../context/AppContext';
import { useData } from '../../../../data/data';
import { isComposite } from '../Composite';
import { typesString } from '../../../../utils/string';

export const renderStartMethodSelect = (props: GenericFieldProps) => {
  return <StartMethodSelect {...props} />;
};

const StartMethodSelect = ({ label, value, onChange }: GenericFieldProps) => {
  const { context } = useAppContext();
  const { element } = useData();
  const methods =
    useMeta('meta/composite/all', context, [])
      .data.find(composite => isComposite(element) && composite.id === element?.config.name)
      ?.startMethods.map<{ label: string; value: string }>(method => ({
        label: `${method.name}(${typesString(method.parameters)})`,
        value: method.name
      })) ?? [];
  return (
    <BasicField label={label}>
      <BasicSelect items={methods} value={value.toString()} onValueChange={onChange} />
    </BasicField>
  );
};