import { isButton } from '@axonivy/form-editor-protocol';
import type { GenericFieldProps } from '../../../../types/config';
import { useData } from '../../../../data/data';
import { useValidation } from '../../../../context/useValidation';
import { useTranslation } from 'react-i18next';
import { InputFieldWithBrowser } from '../../../../editor/sidebar/fields/InputFieldWithBrowser';

export const renderActionField = (props: GenericFieldProps) => {
  return <ActionField {...props} />;
};

const ActionField = ({ value, onChange, validationPath }: GenericFieldProps) => {
  const { element } = useData();
  const { t } = useTranslation();
  const message = useValidation(validationPath);

  return (
    <InputFieldWithBrowser
      label={
        isButton(element) && (element.config.type === 'DELETE' || element.config.type === 'EDIT')
          ? t('property.additionalAction')
          : t('property.action')
      }
      value={value as string}
      onChange={onChange}
      message={message}
      browsers={[{ type: 'LOGIC' }, { type: 'ATTRIBUTE', options: { withoutEl: true, overrideSelection: true } }]}
    />
  );
};
