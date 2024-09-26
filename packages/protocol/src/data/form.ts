/* eslint-disable */
// prettier-ignore
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type ButtonVariant = ("PRIMARY" | "SECONDARY" | "DANGER")
export type InputType = "TEXT" | "EMAIL" | "PASSWORD" | "NUMBER";
export type LayoutGridVariant = "GRID2" | "GRID4" | "FREE";
export type LayoutJustifyContent = "NORMAL" | "END";
export type LayoutType = "GRID" | "FLEX";
export type OrientationType = "horizontal" | "vertical";
export type TextIconStyle = "INLINE" | "BLOCK";
export type TextType = "RAW" | "MARKDOWN";

export interface Form {
  $schema: string;
  id: string;
  config: FormConfig;
  components: Component[];
}
export interface FormConfig {
  renderer: string;
  theme: string;
}
export interface Component {
  id: string;
  type:
    | "Button"
    | "Checkbox"
    | "Combobox"
    | "Composite"
    | "DataTable"
    | "DatePicker"
    | "Fieldset"
    | "Input"
    | "Layout"
    | "Link"
    | "Panel"
    | "Radio"
    | "Select"
    | "Text"
    | "Textarea";
  config:
    | Button
    | Checkbox
    | Combobox
    | Composite
    | DataTable
    | DatePicker
    | Fieldset
    | Input
    | Layout
    | Link
    | Panel
    | Radio
    | Select
    | Text
    | Textarea;
}
export interface Button {
  action: string;
  disabled: string;
  icon: string;
  lgSpan: string;
  mdSpan: string;
  name: string;
  variant: ButtonVariant;
  visible: string;
}
export interface Checkbox {
  disabled: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  selected: string;
  visible: string;
}
export interface Combobox {
  completeMethod: string;
  disabled: string;
  itemLabel: string;
  itemValue: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  required: string;
  requiredMessage: string;
  value: string;
  visible: string;
  withDropdown: boolean;
}
export interface Composite {
  lgSpan: string;
  mdSpan: string;
  name: string;
  parameters: MapStringString;
  startMethod: string;
}
export interface MapStringString {
  [k: string]: string;
}
export interface DataTable {
  components: DataTableColumn[];
  lgSpan: string;
  maxRows: string;
  mdSpan: string;
  paginator: boolean;
  value: string;
  visible: string;
}
export interface DataTableColumn {
  config: DataTableColumnConfig;
  id: string;
}
export interface DataTableColumnConfig {
  filterable: boolean;
  header: string;
  sortable: boolean;
  value: string;
  visible: string;
}
export interface DatePicker {
  datePattern: string;
  disabled: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  required: string;
  requiredMessage: string;
  showTime: boolean;
  timePattern: string;
  value: string;
  visible: string;
}
export interface Fieldset {
  collapsed: boolean;
  collapsible: boolean;
  components: Component[];
  legend: string;
  lgSpan: string;
  mdSpan: string;
  visible: string;
}
export interface Input {
  disabled: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  required: string;
  requiredMessage: string;
  type: InputType;
  value: string;
  visible: string;
}
export interface Layout {
  components: Component[];
  gridVariant: LayoutGridVariant;
  justifyContent: LayoutJustifyContent;
  lgSpan: string;
  mdSpan: string;
  type: LayoutType;
  visible: string;
}
export interface Link {
  href: string;
  lgSpan: string;
  mdSpan: string;
  name: string;
  visible: string;
}
export interface Panel {
  collapsed: boolean;
  collapsible: boolean;
  components: Component[];
  lgSpan: string;
  mdSpan: string;
  title: string;
  visible: string;
}
export interface Radio {
  disabled: string;
  dynamicItemsLabel: string;
  dynamicItemsList: string;
  dynamicItemsValue: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  orientation: OrientationType;
  required: string;
  requiredMessage: string;
  staticItems: SelectItem[];
  value: string;
  visible: string;
}
export interface SelectItem {
  label: string;
  value: string;
}
export interface Select {
  disabled: string;
  dynamicItemsLabel: string;
  dynamicItemsList: string;
  dynamicItemsValue: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  required: string;
  requiredMessage: string;
  staticItems: SelectItem[];
  value: string;
  visible: string;
}
export interface Text {
  content: string;
  icon: string;
  iconStyle: TextIconStyle;
  lgSpan: string;
  mdSpan: string;
  type: TextType;
  visible: string;
}
export interface Textarea {
  autoResize: boolean;
  disabled: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  required: string;
  requiredMessage: string;
  rows: string;
  value: string;
  visible: string;
}
