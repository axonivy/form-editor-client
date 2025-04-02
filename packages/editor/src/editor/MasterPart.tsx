import { Flex, ResizablePanel } from '@axonivy/ui-components';
import { ErrorBoundary } from 'react-error-boundary';
import { useAppContext } from '../context/AppContext';
import { useData } from '../data/data';
import { Canvas } from './canvas/Canvas';
import { ErrorFallback } from './canvas/ErrorFallback';
import { FormToolbar } from './FormToolbar';
import { useRef } from 'react';

export const MasterPart = () => {
  const { setSelectedElement, setUi } = useAppContext();
  const { data } = useData();
  const toolbarDiv = useRef<HTMLDivElement>(null);

  const isClickOutside = (e: React.MouseEvent) => {
    return e.target !== e.currentTarget && !toolbarDiv.current?.contains(e.target as Node);
  };

  return (
    <ResizablePanel
      id='canvas'
      order={2}
      defaultSize={50}
      minSize={30}
      className='panel'
      onClick={e => {
        if (isClickOutside(e)) {
          setSelectedElement(undefined);
        }
      }}
      onDoubleClick={e => {
        if (isClickOutside(e)) {
          setUi(old => ({ ...old, properties: !old.properties }));
        }
      }}
    >
      <Flex direction='column' className='canvas-panel'>
        <FormToolbar ref={toolbarDiv} />
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[data]}>
          <Canvas />
        </ErrorBoundary>
      </Flex>
    </ResizablePanel>
  );
};
