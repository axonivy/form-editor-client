import { isFreeLayout, type ComponentData, type ConfigData } from '@axonivy/form-editor-protocol';
import { type Field, type Fields, type HiddenField } from '../../types/config';
import { groupBy } from '../../utils/array';

export type VisibleFields = ReturnType<typeof visibleFields>;

export const visibleFields = (fields: Fields, elementConfig: ConfigData) => {
  return Object.entries(fields)
    .filter(([, field]) => isNotHiddenField(field))
    .filter(([, field]) => field.hide === undefined || !field.hide(elementConfig))
    .map(([key, field]) => ({ key, field, value: elementConfig[key] }));
};

const isNotHiddenField = (field: Field): field is Exclude<Field, HiddenField> => {
  return field.type !== 'hidden';
};

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const visibleSections = (fields: VisibleFields, parent?: ComponentData) => {
  const sections = groupBy(fields, field => field.field.section ?? 'Properties');
  return new Map(
    (Object.entries(sections) as Entries<typeof sections>).filter(([section]) => section !== 'Layout' || isFreeLayout(parent))
  );
};

export const groupFieldsBySubsection = (fields: VisibleFields) => {
  const subsections = new Map<string, { title: string; fields: VisibleFields }>();
  fields.forEach(visibleField => {
    const title = visibleField.field.subsection;
    let subsection = subsections.get(title);
    if (subsection === undefined) {
      subsection = { title, fields: [] };
      subsections.set(title, subsection);
    }
    subsection.fields.push(visibleField);
  });
  return Array.from(subsections.values());
};
