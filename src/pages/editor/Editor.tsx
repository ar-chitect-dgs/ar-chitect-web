import './Editor.css';
import Display from "./display/Display";
import GUI from "./gui/GUI";

function Editor() {
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

export default Editor