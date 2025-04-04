/* eslint-disable */
// prettier-ignore
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type CmsQuickactionCategory = ("global" | "local")
export type ContentObjectType = "STRING" | "FILE" | "FOLDER";
export type FormType = "FORM" | "COMPONENT";
export type LayoutAlignItems = "START" | "CENTER" | "END";
export type ButtonType = "SUBMIT" | "BUTTON" | "RESET" | "EDIT" | "DELETE";
export type ButtonVariant = "PRIMARY" | "SECONDARY" | "DANGER";
export type SymbolPosition = "p" | "s";
export type InputType = "TEXT" | "EMAIL" | "PASSWORD" | "NUMBER";
export type LayoutGridVariant = "GRID1" | "GRID2" | "GRID4" | "FREE";
export type LayoutJustifyContent = "NORMAL" | "SPACE_BETWEEN" | "END";
export type LayoutType = "GRID" | "FLEX";
export type OrientationType = "horizontal" | "vertical";
export type TextIconStyle = "INLINE" | "BLOCK";
export type TextType = "RAW" | "MARKDOWN";
export type Severity = "INFO" | "WARNING" | "ERROR";

export interface Forms {
  cmsQuickAction: CmsQuickAction[];
  cmsQuickActionRequest: CmsQuickActionRequest;
  compositeContext: CompositeContext;
  compositeInfo: CompositeInfo[];
  contentObject: ContentObject[];
  editorFileContent: EditorFileContent;
  executeCmsQuickActionRequest: ExecuteCmsQuickActionRequest;
  extractContext: ExtractContext;
  form: Form;
  formActionArgs: FormActionArgs;
  formCmsMetaRequest: FormCmsMetaRequest;
  formContext: FormContext;
  formEditorData: FormEditorData;
  formSaveDataArgs: FormSaveDataArgs;
  logicInfo: LogicInfo;
  parameterInfo: ParameterInfo[];
  string: string;
  validationResult: ValidationResult[];
  variableInfo: VariableInfo;
  void: Void;
  [k: string]: unknown;
}
export interface CmsQuickAction {
  category: CmsQuickactionCategory;
  coContent: string;
  coName: string;
  parentUri: string;
}
export interface CmsQuickActionRequest {
  context: FormContext;
  text: string;
}
export interface FormContext {
  app: string;
  file: string;
  pmv: string;
}
export interface CompositeContext {
  compositeId: string;
  context: FormContext;
}
export interface CompositeInfo {
  id: string;
  startMethods: MethodInfo[];
}
export interface MethodInfo {
  deprecated: boolean;
  name: string;
  parameters: ParameterInfo[];
}
export interface ParameterInfo {
  description: string;
  name: string;
  type: string;
}
export interface ContentObject {
  children: ContentObject[];
  fullPath: string;
  name: string;
  type: ContentObjectType;
  values: MapStringString;
}
export interface MapStringString {
  [k: string]: string;
}
export interface EditorFileContent {
  content: string;
}
export interface ExecuteCmsQuickActionRequest {
  cmsQuickAction: CmsQuickAction;
  context: FormContext;
}
export interface ExtractContext {
  context: FormContext;
  layoutId: string;
  newComponentName: string;
}
export interface Form {
  $schema: string;
  id: string;
  config: FormConfig;
  components: Component[];
}
export interface FormConfig {
  renderer: "JSF";
  theme: string;
  type: FormType;
}
export interface Component {
  cid: string;
  type:
    | "Button"
    | "Checkbox"
    | "Combobox"
    | "Composite"
    | "DataTable"
    | "DatePicker"
    | "Dialog"
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
    | Dialog
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
  alignSelf: LayoutAlignItems;
  disabled: string;
  icon: string;
  id: string;
  lgSpan: string;
  mdSpan: string;
  name: string;
  processOnlySelf: boolean;
  type: ButtonType;
  variant: ButtonVariant;
  visible: string;
}
export interface Checkbox {
  alignSelf: LayoutAlignItems;
  disabled: string;
  id: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  selected: string;
  updateOnChange: boolean;
  visible: string;
}
export interface Combobox {
  alignSelf: LayoutAlignItems;
  completeMethod: string;
  disabled: string;
  id: string;
  itemLabel: string;
  itemValue: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  required: string;
  requiredMessage: string;
  updateOnChange: boolean;
  value: string;
  visible: string;
  withDropdown: boolean;
}
export interface Composite {
  alignSelf: LayoutAlignItems;
  id: string;
  lgSpan: string;
  mdSpan: string;
  name: string;
  parameters: MapStringString;
  startMethod: string;
}
export interface DataTable {
  addButton: boolean;
  alignSelf: LayoutAlignItems;
  components: TableComponent[];
  editDialogId: string;
  id: string;
  isEditable: boolean;
  lgSpan: string;
  maxRows: string;
  mdSpan: string;
  paginator: boolean;
  rowType: string;
  value: string;
  visible: string;
}
export interface TableComponent {
  cid: string;
  type: "DataTableColumn";
  config: DataTableColumn;
}
export interface DataTableColumn {
  actionColumnAsMenu: boolean;
  asActionColumn: boolean;
  components: ActionColumnComponent[];
  filterable: boolean;
  header: string;
  sortable: boolean;
  value: string;
  visible: string;
}
export interface ActionColumnComponent {
  cid: string;
  type: "Button";
  config: Button;
}
export interface DatePicker {
  alignSelf: LayoutAlignItems;
  datePattern: string;
  disabled: string;
  id: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  required: string;
  requiredMessage: string;
  showTime: boolean;
  timePattern: string;
  updateOnChange: boolean;
  value: string;
  visible: string;
}
export interface Dialog {
  alignSelf: LayoutAlignItems;
  components: Component[];
  header: string;
  id: string;
  lgSpan: string;
  linkedComponent: string;
  mdSpan: string;
}
export interface Fieldset {
  alignSelf: LayoutAlignItems;
  collapsed: boolean;
  collapsible: boolean;
  components: Component[];
  id: string;
  legend: string;
  lgSpan: string;
  mdSpan: string;
  visible: string;
}
export interface Input {
  alignSelf: LayoutAlignItems;
  decimalPlaces: string;
  disabled: string;
  id: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  required: string;
  requiredMessage: string;
  symbol: string;
  symbolPosition: SymbolPosition;
  type: InputType;
  updateOnChange: boolean;
  value: string;
  visible: string;
}
export interface Layout {
  alignSelf: LayoutAlignItems;
  components: Component[];
  gridVariant: LayoutGridVariant;
  id: string;
  justifyContent: LayoutJustifyContent;
  lgSpan: string;
  mdSpan: string;
  type: LayoutType;
  visible: string;
}
export interface Link {
  alignSelf: LayoutAlignItems;
  href: string;
  id: string;
  lgSpan: string;
  mdSpan: string;
  name: string;
  visible: string;
}
export interface Panel {
  alignSelf: LayoutAlignItems;
  collapsed: boolean;
  collapsible: boolean;
  components: Component[];
  id: string;
  lgSpan: string;
  mdSpan: string;
  title: string;
  visible: string;
}
export interface Radio {
  alignSelf: LayoutAlignItems;
  disabled: string;
  dynamicItemsLabel: string;
  dynamicItemsList: string;
  dynamicItemsValue: string;
  id: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  orientation: OrientationType;
  required: string;
  requiredMessage: string;
  staticItems: SelectItem[];
  updateOnChange: boolean;
  value: string;
  visible: string;
}
export interface SelectItem {
  label: string;
  value: string;
}
export interface Select {
  alignSelf: LayoutAlignItems;
  disabled: string;
  dynamicItemsLabel: string;
  dynamicItemsList: string;
  dynamicItemsValue: string;
  id: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  required: string;
  requiredMessage: string;
  staticItems: SelectItem[];
  updateOnChange: boolean;
  value: string;
  visible: string;
}
export interface Text {
  alignSelf: LayoutAlignItems;
  content: string;
  icon: string;
  iconStyle: TextIconStyle;
  id: string;
  lgSpan: string;
  mdSpan: string;
  type: TextType;
  visible: string;
}
export interface Textarea {
  alignSelf: LayoutAlignItems;
  autoResize: boolean;
  disabled: string;
  id: string;
  label: string;
  lgSpan: string;
  mdSpan: string;
  required: string;
  requiredMessage: string;
  rows: string;
  updateOnChange: boolean;
  value: string;
  visible: string;
}
export interface FormActionArgs {
  actionId: "openComponent" | "openDataClass" | "openProcess" | "openUrl";
  context: FormContext;
  payload: string;
}
export interface FormCmsMetaRequest {
  context: FormContext;
  requiredProjects: boolean;
}
export interface FormEditorData {
  context: FormContext;
  data: Form;
  defaults: DefaultConfig;
  helpUrl: string;
  readonly: boolean;
}
export interface DefaultConfig {}
export interface FormSaveDataArgs {
  context: FormContext;
  data: Form;
}
export interface LogicInfo {
  eventStarts: LogicEventInfo[];
  startMethods: LogicMethodInfo[];
}
export interface LogicEventInfo {
  description: string;
  name: string;
}
export interface LogicMethodInfo {
  description: string;
  name: string;
  parameters: Parameter[];
  returnParameter: Parameter;
}
export interface Parameter {
  name: string;
  type: string;
}
export interface ValidationResult {
  message: string;
  path: string;
  severity: Severity;
}
export interface VariableInfo {
  types: MapStringListVariable;
  variables: Variable[];
}
export interface MapStringListVariable {
  [k: string]: Variable[];
}
export interface Variable {
  attribute: string;
  description: string;
  simpleType: string;
  type: string;
}
export interface Void {}
