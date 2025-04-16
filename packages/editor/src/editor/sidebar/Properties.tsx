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
import { usePropertySubSectionControl } from './PropertySubSectionControl';
import { useBase } from '../../components/blocks/base';
import { useComponents } from '../../context/ComponentsContext';
import { groupFieldsBySubsection, visibleFields, visibleSections, type VisibleFields } from './property';
import type { ConfigData } from '@axonivy/form-editor-protocol';

/*
const formTypeOptions: FieldOption<FormType>[] = [
  { label: 'Component', value: 'COMPONENT' },
  { label: 'Form', value: 'FORM' }
] as const;
*/

export const Properties = () => {
  const { componentByElement } = useComponents();
  const { element, data, parent } = useData();
  if (element === undefined) {
    return <PanelMessage message='Select an Element to edit its properties.' />;
    // return <FormPropertySection />;
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
  const { categoryTranslations: CategoryTranslations } = useBase();
  return (
    <AccordionItem key={section} value={section}>
      <AccordionTrigger>{section}</AccordionTrigger>
      <AccordionContent>
        <Flex direction='column' gap={2}>
          {groupFieldsBySubsection(fields).map(({ title, fields }) => (
            <PropertySubSection key={title} title={CategoryTranslations[title]} fields={fields} />
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
              field={{ ...field, label: field.label ?? key }}
            />
          ))}
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};

/*
const FormPropertySection = () => {
  const { data, setData } = useData();
  const { t } = useTranslation();
  return (
    <Accordion type='single' collapsible defaultValue='Properties'>
      <AccordionItem value='Properties'>
        <AccordionTrigger>{t('components.form.accordion')}</AccordionTrigger>
        <AccordionContent>
          <Flex direction='column' gap={2}>
            <Collapsible defaultOpen={true}>
              <CollapsibleTrigger>{t('category.general')}</CollapsibleTrigger>
              <CollapsibleContent>
                <Flex direction='column' gap={2}>
                  <SelectField
                    label={t('components.form.type')}
                    options={formTypeOptions}
                    value={data.config.type}
                    onChange={value => {
                      setData(data => {
                        data.config.type = value as FormType;
                        return data;
                      });
                    }}
                  />
                </Flex>
              </CollapsibleContent>
            </Collapsible>
          </Flex>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
*/
