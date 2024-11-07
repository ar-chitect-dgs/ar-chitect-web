import GUI from './gui/GUI';
import Viewport from './viewport/Viewport';

import './Editor.css';

function Editor(): JSX.Element {
  return (
    <div className="Editor">
      <div className="Display">
        <Viewport />
      </div>
      <div className="GUI">
        <GUI />
      </div>
    </div>
  );
}

export default Editor;
