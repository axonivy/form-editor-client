import { Flex, ResizablePanel } from '@axonivy/ui-components';
import { ErrorBoundary } from 'react-error-boundary';
import { useAppContext } from '../context/AppContext';
import { useData } from '../data/data';
import { Canvas } from './canvas/Canvas';
import { ErrorFallback } from './canvas/ErrorFallback';
import { FormToolbar } from './FormToolbar';
import { useRef, type ComponentProps } from 'react';

export const MasterPart = () => {
  const { history, setSelectedElement } = useAppContext();
  const { data, setUnhistoricisedData } = useData();
  const keyHandler: ComponentProps<'div'>['onKeyDown'] = e => {
    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
      e.stopPropagation();
      if (e.shiftKey) {
        history.redo(setUnhistoricisedData);
      } else {
        history.undo(setUnhistoricisedData);
      }
    }
  };
  const toolbarDiv = useRef<HTMLDivElement>(null);

  return (
    <ResizablePanel
      id='canvas'
      order={2}
      defaultSize={50}
      minSize={30}
      className='panel'
      onClick={e => {
        if (e.target !== e.currentTarget && !toolbarDiv.current?.contains(e.target as Node)) {
          setSelectedElement(undefined);
        }
      }}
    >
      <Flex direction='column' className='canvas-panel' tabIndex={1} onKeyDown={keyHandler}>
        <FormToolbar ref={toolbarDiv} />
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[data]}>
          <Canvas />
        </ErrorBoundary>
      </Flex>
    </ResizablePanel>
  );
};
