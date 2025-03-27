import type { Textarea, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Textarea.css';
import { useBase } from '../base';
import IconSvg from './Textarea.svg?react';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type TextareaProps = Prettify<Textarea>;

export const useTextareaComponent = () => {
  const { baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent } = useBase();
  const { t } = useTranslation();

  const TextareaComponent = useMemo(() => {
    const defaultInputProps: Textarea = {
      label: t('components.textarea.name'),
      value: '',
      rows: '5',
      autoResize: true,
      ...defaultBehaviourComponent,
      ...defaultBaseComponent
    } as const;

    const TextareaComponent: ComponentConfig<TextareaProps> = {
      name: 'Textarea',
      displayName: t('components.textarea.name'),
      category: 'Elements',
      subcategory: 'Input',
      icon: <IconSvg />,
      description: t('components.textarea.description'),
      defaultProps: defaultInputProps,
      render: props => <UiBlock {...props} />,
      create: ({ label, value, ...defaultProps }) => ({ ...defaultInputProps, label, value, ...defaultProps }),
      outlineInfo: component => component.label,
      fields: {
        ...baseComponentFields,
        label: {
          subsection: 'General',
          label: t('property.label'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
        },
        value: { subsection: 'General', label: t('property.value'), type: 'textBrowser', browsers: [{ type: 'ATTRIBUTE' }] },
        rows: { subsection: 'General', label: t('components.textarea.property.visibleRows'), type: 'number' },
        autoResize: { subsection: 'General', label: t('components.textarea.property.autoResize'), type: 'checkbox' },
        ...behaviourComponentFields
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return TextareaComponent;
  }, [baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent, t]);

  return {
    TextareaComponent
  };
};

const UiBlock = ({ label, value, rows, autoResize, visible, required, disabled, updateOnChange }: UiComponentProps<TextareaProps>) => {
  return (
    <div className='block-textarea'>
      <UiBlockHeader
        visible={visible}
        label={label}
        required={required}
        disabled={disabled}
        additionalInfo={rows + ' rows'}
        updateOnChange={updateOnChange}
      />
      <div className='block-textarea__input-wrapper'>
        <span className='block-textarea__input'>
          <UiBadge value={value} />
        </span>
        {!autoResize && <div className='resize-icon' />}
      </div>
    </div>
  );
};
