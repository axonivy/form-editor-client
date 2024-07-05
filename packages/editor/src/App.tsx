import { Editor } from './components/editor/Editor';
import '@axonivy/ui-icons/lib/ivy-icons.css';
import '@axonivy/ui-components/lib/style.css';
import type { FormEditorProps } from '@axonivy/form-editor-protocol';

function App(props: FormEditorProps) {
  return <Editor {...props} />;
}

export default App;
