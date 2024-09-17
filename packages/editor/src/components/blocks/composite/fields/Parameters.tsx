import { Message } from '@axonivy/ui-components';
import type { GenericFieldProps } from '../../../../types/config';
import { useMeta } from '../../../../context/useMeta';
import { useAppContext } from '../../../../context/AppContext';
import { useData } from '../../../../data/data';
import { isComposite } from '../Composite';
import { InputFieldWithBrowser } from '../../../../editor/sidebar/fields/InputFieldWithBrowser';
import type { PrimitiveValue } from '@axonivy/form-editor-protocol';

export const renderParameters = (props: GenericFieldProps) => {
  return <Parameters {...props} />;
};

const isStringRecord = (primitive?: PrimitiveValue): primitive is Record<string, string> =>
  primitive !== undefined && typeof primitive === 'object';

const Parameters = ({ value, onChange }: GenericFieldProps) => {
  const { context } = useAppContext();
  const { element } = useData();
  const method = useMeta('meta/composite/all', context, [])
    .data.find(composite => isComposite(element) && composite.id === element?.config.name)
    ?.startMethods.find(method => isComposite(element) && method.name === element?.config.startMethod);
  if (!isStringRecord(value)) {
    return null;
  }
  if (method === undefined || method?.parameters.length === 0) {
    return <Message variant='info' message='No parameters' />;
  }
  const updateValue = (key: string, newValue: string) => {
    value[key] = newValue;
    onChange(value);
  };
  return (
    <>
      {method.parameters.map(param => (
        <InputFieldWithBrowser
          key={param.name}
          label={param.name}
          value={value[param.name]}
          onChange={change => updateValue(param.name, change)}
          browsers={['ATTRIBUTE']}
          options={{ onlyTypesOf: param.type }}
        />
      ))}
    </>
  );
};
