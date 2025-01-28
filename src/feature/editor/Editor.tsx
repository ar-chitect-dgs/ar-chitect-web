import EditorToolbar from './toolbar/Toolbar';
import EditorViewport from './viewport/Viewport';

import './Editor.css';
import { KeyboardProvider } from './KeyboardProvider';

function Editor(): JSX.Element {
  return (
    <KeyboardProvider>
      <div className="editor">
        <div className="display">
          <EditorViewport />
        </div>
        <div className="toolbar">
          <EditorToolbar />
        </div>
      </div>
    </KeyboardProvider>
  );
}

export default Editor;
