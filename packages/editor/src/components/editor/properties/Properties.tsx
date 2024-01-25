import type { Config } from '../../../types/config';
import { useData } from '../../../data/useData';
import { PropertyItem } from './PropertyItem';
import { Flex, SidebarHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

type PropertiesProps = {
  config: Config;
};

export const Properties = ({ config }: PropertiesProps) => {
  const { element } = useData();
  const propertyConfig = element ? config.components[element?.type] : undefined;
  return (
    <Flex direction='column' className='properties'>
      <SidebarHeader icon={IvyIcons.PenEdit} title='Properties' />
      <Flex direction='column' gap={2} style={{ paddingBlock: 'var(--size-2)' }}>
        {propertyConfig &&
          propertyConfig.fields &&
          Object.entries(propertyConfig.fields).map(([key, field]) => <PropertyItem key={key} fieldName={key} field={field} />)}
      </Flex>
    </Flex>
  );
};
