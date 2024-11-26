import EditorToolbar from './toolbar/Toolbar';
import EditorViewport from './viewport/Viewport';

import './Editor.css';

function Editor(): JSX.Element {
  return (
    <div className="editor">
      <div className="display">
        <EditorViewport />
      </div>
      <div className="toolbar">
        <EditorToolbar />
      </div>
    </div>
  );
}

export default Editor;
