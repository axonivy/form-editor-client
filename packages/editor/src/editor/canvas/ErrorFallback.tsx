import { IvyIcons } from '@axonivy/ui-icons';
import type { FallbackProps } from 'react-error-boundary';
import { PanelMessage } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';

export const ErrorFallback = (props: FallbackProps) => {
  const { t } = useTranslation();
  return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('message.errorOnly', { error: props.error.message })} />;
};
