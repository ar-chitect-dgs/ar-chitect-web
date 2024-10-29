import Display from './display/Display';
import GUI from './gui/GUI';

import './Editor.css';

function Editor(): JSX.Element {
  return (
    <div className="Editor">
      <div className="Display">
        <Display />
      </div>
      <div className="GUI">
        <GUI />
      </div>
    </div>
  );
}

export default Editor;
