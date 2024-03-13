import { Editor } from './components/editor/Editor';
import '@axonivy/ui-icons/lib/ivy-icons.css';
import '@axonivy/ui-components/lib/style.css';
import type { FormContext } from '@axonivy/form-editor-protocol';

function App(props: FormContext) {
  return <Editor {...props} />;
}

export default App;
