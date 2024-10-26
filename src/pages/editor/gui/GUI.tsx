import { useSelector } from 'react-redux';
import Properties from '../../../components/properties/Properties';
import { Object } from '../../../types/Scene';
import './GUI.css';
import { sceneSelector } from '../../../slices/scene';

function GUI() {
  const { scene } = useSelector(sceneSelector);

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