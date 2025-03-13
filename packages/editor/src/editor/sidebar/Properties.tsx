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
import type { ConfigData, VariableInfo } from '@axonivy/form-editor-protocol';
import { PropertySubSectionControl } from './PropertySubSectionControl';
import { useMeta } from '../../context/useMeta';
import { useAppContext } from '../../context/AppContext';
import { findAttributesOfType } from '../browser/data-class/variable-tree-data';

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
  const { context } = useAppContext();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
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
                if (element.type === 'DataTable' && key === 'value') {
                  setElement(element => {
                    (element.config as ConfigData)['value'] = change;
                    (element.config as ConfigData)['rowType'] = getRowType(change as string, variableInfo);
                    return element;
                  });
                } else {
                  setElement(element => {
                    (element.config as ConfigData)[key] = change;
                    return element;
                  });
                }
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

export const getRowType = (value: string, variableInfo: VariableInfo) => {
  const tree = findAttributesOfType(variableInfo, value);
  if (tree.length > 0) {
    return tree[0].info;
  }
  return '';
};
