import { useSelector } from 'react-redux';
import { sceneSelector } from '../../../redux/slices/scene';
import { SceneObject } from '../../../types/Scene';
import './GUI.css';
import Properties from './properties/Properties';

function GUI(): JSX.Element {
  const { scene } = useSelector(sceneSelector);

  return (
    <div>
      <div className="header">GUI</div>
      <div className="PropertiesPanel">
        {Object.values(scene.objects).map(
          (val: SceneObject) => <Properties key={val.id} object={val} />,
        )}
      </div>
    </div>
  );
}

export default GUI;
