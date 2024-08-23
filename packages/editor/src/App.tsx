import { Editor } from './editor/Editor';
import type { FormEditorProps } from '@axonivy/form-editor-protocol';
import './App.css';

function App(props: FormEditorProps) {
  return <Editor {...props} />;
}

export default App;
