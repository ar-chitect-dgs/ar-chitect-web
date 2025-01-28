import './Creator.css';
import CreatorToolbar from './toolbar/Toolbar';
import CreatorViewport from './viewport/Viewport';

function Creator(): JSX.Element {
  return (
    <div className="editor">
      <div className="display">
        <CreatorViewport />
      </div>
      <div className="toolbar">
        <CreatorToolbar />
      </div>
    </div>
  );
}

export default Creator;
