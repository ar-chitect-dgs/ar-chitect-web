import Properties from '../../../components/properties/Properties';
import { Object, Scene } from '../../../types/Scene';
import './GUI.css';

interface GUIProps {
  scene: Scene;
}

function GUI({ scene }: GUIProps) {
  return (
    <div>
      <div className="header">GUI</div>
      <div className="PropertiesPanel">
        {scene.objects.map((val: Object) => <Properties key={val.id} object={val} />)}
      </div>
    </div>
  );
}

export default GUI