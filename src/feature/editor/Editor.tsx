import Toolbar from './toolbar/Toolbar';
import Viewport from './viewport/Viewport';

import './Editor.css';

function Editor(): JSX.Element {
  return (
    <div className="editor">
      <div className="display">
        <Viewport />
      </div>
      <div className="toolbar">
        <Toolbar />
      </div>
    </div>
  );
}

export default Editor;
