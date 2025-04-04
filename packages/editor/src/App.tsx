import { Editor, type FormEditorProps } from './editor/Editor';
import './App.css';

function App(props: FormEditorProps) {
  return <Editor {...props} />;
}

export default App;
