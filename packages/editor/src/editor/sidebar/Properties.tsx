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
import { useComponents } from '../../components/components';
import type { ConfigData } from '@axonivy/form-editor-protocol';
import { usePropertySubSectionControl } from './PropertySubSectionControl';
import { useTranslation } from 'react-i18next';
import { useBase } from '../../components/blocks/base';

export const Properties = () => {
  const { componentByElement } = useComponents();
  const { t } = useTranslation();
  const { element, data, parent } = useData();
  if (element === undefined) {
    return <PanelMessage message={t('hint.elementPropsEdit')} />;
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

const PropertySection = ({ section, fields }: { section: string; fields: VisibleFields }) => {
  const { Lookup } = useBase();
  return (
    <AccordionItem key={section} value={section}>
      <AccordionTrigger>{section}</AccordionTrigger>
      <AccordionContent>
        <Flex direction='column' gap={2}>
          {groupFieldsBySubsection(fields).map(({ title, fields }) => (
            <PropertySubSection key={title} title={Lookup[title]} fields={fields} />
          ))}
        </Flex>
      </AccordionContent>
    </AccordionItem>
  );
};

const PropertySubSection = ({ title, fields }: { title: string; fields: VisibleFields }) => {
  const { element, setElement } = useData();
  const { PropertySubSectionControl } = usePropertySubSectionControl();
  if (element === undefined) {
    return null;
  }

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger control={props => <PropertySubSectionControl title={title} {...props} />}>{title}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={2}>
          {fields.map(({ key, field, value }) => (
            <PropertyItem
              key={`${element.cid}-${key}`}
              value={value}
              onChange={change => {
                setElement(element => {
                  (element.config as ConfigData)[key] = change;
                  return element;
                });
              }}
              fieldKey={key}
              field={field}
            />
          ))}
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
