import type { LayoutAlignItems, SelectItem } from '@axonivy/form-editor-protocol';
import type { FieldOption, Fields, GenericFieldProps, ItemCategory, ItemSubcategory, Subsection } from '../../types/config';
import { BasicField, Input } from '@axonivy/ui-components';
import { useAppContext } from '../../context/AppContext';
import { useValidation } from '../../context/useValidation';
import { hideButtonField } from './button/Button';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const useBase = () => {
  const { t } = useTranslation();

  const Lookup: Record<ItemCategory | ItemSubcategory | Subsection, string> = {
    Elements: t('category.elements'),
    Structures: t('category.structures'),
    Actions: t('category.actions'),
    Hidden: t('category.hidden'),
    General: t('category.general'),
    Input: t('category.input'),
    Selection: t('category.selection'),
    Text: t('category.text'),
    Styling: t('category.styling'),
    Behaviour: t('category.behaviour'),
    Options: t('category.options'),
    'Static Options': t('category.staticOptions'),
    'Dynamic Options': t('category.dynamicOptions'),
    Columns: t('category.columns')
  };

  type BaseComponentProps = { id: string; alignSelf: LayoutAlignItems; lgSpan: string; mdSpan: string };
  type SelectItemsProps = {
    label: string;
    value: string;
    staticItems: SelectItem[];
    dynamicItemsLabel: string;
    dynamicItemsList: string;
    dynamicItemsValue: string;
  };
  type VisibleItemProps = { visible: string };
  type DisabledItemProps = VisibleItemProps & { disabled: string };
  type BehaviourItemProps = DisabledItemProps & { required: string; requiredMessage: string; updateOnChange: boolean };

  const defaultVisibleComponent: VisibleItemProps = {
    visible: ''
  } as const;

  const defaultDisabledComponent: DisabledItemProps = {
    ...defaultVisibleComponent,
    disabled: ''
  } as const;

  const defaultBehaviourComponent: BehaviourItemProps = {
    ...defaultDisabledComponent,
    required: '',
    requiredMessage: '',
    updateOnChange: false
  } as const;

  const defaultBaseComponent: BaseComponentProps = {
    id: '',
    alignSelf: 'START',
    lgSpan: '6',
    mdSpan: '12'
  } as const;

  const alignItemsOptions: FieldOption<LayoutAlignItems>[] = useMemo(
    () =>
      [
        { label: t('align.top'), value: 'START', icon: { icon: IvyIcons.AlignRight, rotate: 270 } },
        { label: t('align.center'), value: 'CENTER', icon: { icon: IvyIcons.AlignHorizontal, rotate: 180 } },
        { label: t('align.bottom'), value: 'END', icon: { icon: IvyIcons.AlignLeft, rotate: 270 } }
      ] as const,
    [t]
  );

  const baseComponentFields: Fields<BaseComponentProps> = useMemo(() => {
    const spanOptions: FieldOption<string>[] = [
      { label: '1', value: '2' },
      { label: '2', value: '4' },
      { label: '3', value: '6' },
      { label: '4', value: '8' },
      { label: '5', value: '10' },
      { label: '6', value: '12' }
    ] as const;
    return {
      id: { subsection: 'General', type: 'generic', label: t('label.id'), render: props => <IdInput {...props} /> },
      alignSelf: {
        section: t('category.layout'),
        subsection: 'General',
        type: 'toggleGroup',
        label: t('label.verticalAlign'),
        options: alignItemsOptions
      },
      lgSpan: {
        section: t('category.layout'),
        subsection: 'General',
        type: 'select',
        label: t('label.largeSpan'),
        options: spanOptions
      },
      mdSpan: {
        section: t('category.layout'),
        subsection: 'General',
        type: 'select',
        label: t('label.mediumSpan'),
        options: spanOptions
      }
    };
  }, [alignItemsOptions, t]);

  const visibleComponentField: Fields<VisibleItemProps> = useMemo(() => {
    return {
      visible: {
        subsection: 'Behaviour',
        label: t('label.visible'),
        type: 'textBrowser',
        browsers: [{ type: 'CONDITION' }],
        hide: data => hideButtonField(data)
      }
    };
  }, [t]);

  const disabledComponentFields: Fields<DisabledItemProps> = useMemo(() => {
    return {
      ...visibleComponentField,
      disabled: {
        subsection: 'Behaviour',
        label: t('label.disable'),
        type: 'textBrowser',
        browsers: [{ type: 'CONDITION' }],
        hide: data => hideButtonField(data)
      }
    };
  }, [t, visibleComponentField]);

  const behaviourComponentFields: Fields<BehaviourItemProps> = useMemo(() => {
    return {
      ...disabledComponentFields,
      required: {
        subsection: 'Behaviour',
        label: t('label.required'),
        type: 'textBrowser',
        browsers: [{ type: 'CONDITION' }]
      },
      requiredMessage: {
        subsection: 'Behaviour',
        label: t('label.requiredMessage'),
        type: 'textBrowser',
        browsers: [{ type: 'CMS', options: { overrideSelection: true } }],
        hide: data => data.required.length === 0
      },
      updateOnChange: { subsection: 'Behaviour', label: t('label.updateFormChange'), type: 'checkbox' }
    };
  }, [disabledComponentFields, t]);

  const selectItemsComponentFields: Fields<SelectItemsProps> = useMemo(() => {
    return {
      label: {
        subsection: 'General',
        label: t('label.label'),
        type: 'textBrowser',
        browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
      },
      value: { subsection: 'General', label: t('label.value'), type: 'textBrowser', browsers: [{ type: 'ATTRIBUTE' }] },
      staticItems: { subsection: 'Static Options', label: t('label.options'), type: 'selectTable' },
      dynamicItemsList: {
        subsection: 'Dynamic Options',
        label: t('label.listOfObjects'),
        type: 'textBrowser',
        browsers: [{ type: 'ATTRIBUTE', options: { typeHint: 'List' } }],
        options: { placeholder: 'e.g. #{data.dynamicList}' } // TODO: Translate
      },
      dynamicItemsLabel: {
        subsection: 'Dynamic Options',
        label: t('label.objectLabel'),
        type: 'textBrowser',
        browsers: [{ type: 'ATTRIBUTE', options: { onlyAttributes: 'DYNAMICLIST', withoutEl: true } }],
        options: {
          placeholder: 'Enter attribute (or leave blank to select entire object)' // TODO: Translate
        },
        hide: data => data.dynamicItemsList.length == 0
      },
      dynamicItemsValue: {
        subsection: 'Dynamic Options',
        label: t('label.objectValue'),
        type: 'textBrowser',
        browsers: [{ type: 'ATTRIBUTE', options: { onlyAttributes: 'DYNAMICLIST', withoutEl: true } }],
        options: {
          placeholder: 'Enter attribute (or leave blank to select entire object)' // TODO: Translate
        },
        hide: data => data.dynamicItemsList.length == 0
      }
    };
  }, [t]);

  const IdInput = ({ label, onChange, value, validationPath }: GenericFieldProps) => {
    const { selectedElement } = useAppContext();
    const message = useValidation(validationPath);
    return (
      <BasicField label={label} message={message}>
        <Input value={value as string} onChange={e => onChange(e.target.value)} placeholder={selectedElement} />
      </BasicField>
    );
  };

  return {
    Lookup,
    defaultVisibleComponent,
    defaultDisabledComponent,
    defaultBehaviourComponent,
    baseComponentFields,
    defaultBaseComponent,
    visibleComponentField,
    disabledComponentFields,
    behaviourComponentFields,
    selectItemsComponentFields
  };
};
