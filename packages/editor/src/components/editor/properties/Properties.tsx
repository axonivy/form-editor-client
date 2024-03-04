import { isNotHiddenField, type Config } from '../../../types/config';
import { useData } from '../../../context/useData';
import { PropertyItem } from './PropertyItem';
import { Flex, SidebarHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { PrimitiveValue } from '@axonivy/form-editor-protocol';

type PropertiesProps = {
  config: Config;
};

export const Properties = ({ config }: PropertiesProps) => {
  const { element, setElement } = useData();
  if (element === undefined) {
    return null;
  }
  const propertyConfig = config.components[element.type];
  const elementConfig = { ...propertyConfig.defaultProps, ...element.config };
  const updateElementConfig = (key: string) => {
    return (change: PrimitiveValue) => {
      element.config[key] = change;
      setElement(element);
    };
  };
  return (
    <Flex direction='column' className='properties'>
      <SidebarHeader icon={IvyIcons.PenEdit} title='Properties' />
      <Flex direction='column' gap={2} style={{ paddingBlock: 'var(--size-2)' }}>
        {propertyConfig &&
          propertyConfig.fields &&
          Object.entries(propertyConfig.fields)
            .filter(([, field]) => isNotHiddenField(field))
            .filter(([, field]) => field.hide === undefined || !field.hide(elementConfig))
            .map(([key, field]) => (
              <PropertyItem
                key={key}
                value={elementConfig[key]}
                onChange={updateElementConfig(key)}
                field={{ ...field, label: field.label ?? key }}
              />
            ))}
      </Flex>
    </Flex>
  );
};
