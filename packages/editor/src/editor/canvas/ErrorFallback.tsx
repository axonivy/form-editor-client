import { IvyIcons } from '@axonivy/ui-icons';
import type { FallbackProps } from 'react-error-boundary';
import { PanelMessage } from '@axonivy/ui-components';

export const ErrorFallback = (props: FallbackProps) => (
  <PanelMessage icon={IvyIcons.ErrorXMark} message={`Error: ${props.error.message}`} />
);
