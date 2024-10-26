import { Scene } from '../../types/Scene';
import './Editor.css';
import Display from "./display/Display";
import GUI from "./gui/GUI";
import { useState } from 'react';

function Editor() {
  // todo: use global state
  const [scene, setScene] = useState<Scene>({
    objects: [
      { id: 1, name: "box", position: [0, 0, 0] },
      { id: 2, name: "box", position: [0, 1, 0] },
      { id: 3, name: "box", position: [0, 1, -1] }
    ]
  })

  return (
    <div className="Editor">
      <div className="Display">
        <Display scene={scene} />
      </div>
      <div className="GUI">
        <GUI scene={scene} />
      </div>
    </div>
  );
}

export default Editor