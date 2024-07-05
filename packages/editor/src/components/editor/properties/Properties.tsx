import { isNotHiddenField, type Config, type DefaultComponentProps, type Field, type Fields } from '../../../types/config';
import { useData } from '../../../context/useData';
import { PropertyItem } from './PropertyItem';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  SidebarHeader
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { isFreeLayout, type ConfigData, type PrimitiveValue, type ComponentData } from '@axonivy/form-editor-protocol';
import { groupBy } from '../../../utils/array';

type PropertiesProps = {
  config: Config;
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

const visibleFields = (fields: Fields, elementConfig: ConfigData) => {
  return Object.entries(fields)
    .filter(([, field]) => isNotHiddenField(field))
    .filter(([, field]) => field.hide === undefined || !field.hide(elementConfig))
    .map(([key, field]) => ({ key, field }));
};

const groupFieldsBySubsection = (fields: ReturnType<typeof visibleFields>) => {
  const subsections = new Map<string, { title: string; fields: { key: string; field: Field<DefaultComponentProps> }[] }>();
  fields.forEach(({ key, field }) => {
    const title = field.subsection;
    if (!subsections.has(title)) {
      subsections.set(title, { title, fields: [] });
    }
    subsections.get(title)!.fields.push({ key, field });
  });

  return Array.from(subsections.values());
};

const visibleSections = (fields: ReturnType<typeof visibleFields>, parent?: ComponentData) => {
  const sections = groupBy(fields, field => field.field.section ?? 'Properties');
  return new Map(
    (Object.entries(sections) as Entries<typeof sections>).filter(([section]) => section !== 'Layout' || isFreeLayout(parent))
  );
};

export const Properties = ({ config }: PropertiesProps) => {
  const { element, setElement, parent } = useData();
  if (element === undefined) {
    return null;
  }
  const propertyConfig = config.components[element.type];
  if (propertyConfig === undefined || propertyConfig.fields === undefined) {
    return null;
  }
  const elementConfig = { ...propertyConfig.defaultProps, ...element.config };
  const updateElementConfig = (key: string) => {
    return (change: PrimitiveValue) => {
      element.config[key] = change;
      setElement(element);
    };
  };
  const fields = visibleFields(propertyConfig.fields, elementConfig);
  const sections = visibleSections(fields, parent);
  return (
    <Flex direction='column' className='properties'>
      <SidebarHeader icon={IvyIcons.PenEdit} title={element.type} />
      <Accordion type='single' collapsible defaultValue='Properties'>
        {[...sections].map(([section, fields]) => (
          <AccordionItem key={section} value={section}>
            <AccordionTrigger>{section}</AccordionTrigger>
            <AccordionContent>
              <Flex direction='column' gap={2}>
                {groupFieldsBySubsection(fields).map(({ title, fields }) => (
                  <div key={title}>
                    <Collapsible defaultOpen={true}>
                      <CollapsibleTrigger>{title}</CollapsibleTrigger>
                      <CollapsibleContent>
                        <Flex direction='column' gap={2}>
                          {fields.map(({ key, field }) => (
                            <PropertyItem
                              key={`${element.id}-${key}`}
                              value={elementConfig[key]}
                              onChange={updateElementConfig(key)}
                              field={{ ...field, label: field.label ?? key }}
                            />
                          ))}
                        </Flex>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </Flex>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
};
