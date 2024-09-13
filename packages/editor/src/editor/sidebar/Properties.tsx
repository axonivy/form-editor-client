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
  PanelMessage
} from '@axonivy/ui-components';
import { useData } from '../../data/data';
import { groupFieldsBySubsection, visibleFields, visibleSections, type VisibleFields } from './property';
import { componentByElement } from '../../components/components';
import type { ConfigData } from '@axonivy/form-editor-protocol';

export const Properties = () => {
  const { element, data, parent } = useData();
  if (element === undefined) {
    return <PanelMessage message='Select an Element to edit its properties.' />;
  }
  const propertyConfig = componentByElement(element, data.components);
  const elementConfig = { ...propertyConfig.defaultProps, ...element.config };
  const fields = visibleFields(propertyConfig.fields, elementConfig);
  const sections = visibleSections(fields, parent);
  return (
    <div style={{ overflowY: 'auto' }}>
      <Accordion type='single' collapsible defaultValue='Properties'>
        {[...sections].map(([section, fields]) => (
          <PropertySection key={section} section={section} fields={fields} />
        ))}
      </Accordion>
    </div>
  );
};

const PropertySection = ({ section, fields }: { section: string; fields: VisibleFields }) => (
  <AccordionItem key={section} value={section}>
    <AccordionTrigger>{section}</AccordionTrigger>
    <AccordionContent>
      <Flex direction='column' gap={2}>
        {groupFieldsBySubsection(fields).map(({ title, fields }) => (
          <PropertySubSection key={title} title={title} fields={fields} />
        ))}
      </Flex>
    </AccordionContent>
  </AccordionItem>
);

const PropertySubSection = ({ title, fields }: { title: string; fields: VisibleFields }) => {
  const { element, setElement } = useData();
  if (element === undefined) {
    return null;
  }
  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>{title}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={2}>
          {fields.map(({ key, field, value }) => (
            <PropertyItem
              key={`${element.id}-${key}`}
              value={value}
              onChange={change => {
                (element.config as ConfigData)[key] = change;
                setElement(element);
              }}
              field={{ ...field, label: field.label ?? key }}
            />
          ))}
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
