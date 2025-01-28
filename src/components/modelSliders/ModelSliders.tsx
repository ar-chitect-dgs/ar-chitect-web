import { FlipCameraAndroid } from '@mui/icons-material';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux';
import {
  Axis,
  moveObject,
  rotateObject,
  sceneSelector,
} from '../../redux/slices/editor';
import { positionToString } from '../../utils/utils';

import { ValueSlider } from '../valueSlider/ValueSlider';
import './ModelSliders.css';

function ModelSliders(): JSX.Element {
  const dispatch = useAppDispatch();
  const { scene } = useSelector(sceneSelector);

  const id = scene.activeObjectId;

  const moveX = useCallback(
    (_event: Event, newValue: number | number[]) => {
      if (id === null) return;
      dispatch(moveObject(id, newValue as number, Axis.X));
    },
    [id],
  );
  const moveY = useCallback(
    (_event: Event, newValue: number | number[]) => {
      if (id === null) return;
      dispatch(moveObject(id, newValue as number, Axis.Y));
    },
    [id],
  );
  const moveZ = useCallback(
    (_event: Event, newValue: number | number[]) => {
      if (id === null) return;
      dispatch(moveObject(id, newValue as number, Axis.Z));
    },
    [id],
  );

  const rotateY = useCallback(
    (_event: Event, newValue: number | number[]) => {
      if (id === null) return;
      dispatch(rotateObject(id, newValue as number, Axis.Y));
    },
    [id],
  );

  if (id === null) {
    return <div />;
  }

  const { name, position, rotation } = scene.objects[id];

  return (
    <div className="container">
      <div className="name">{name}</div>
      <div className="position">{positionToString(position)}</div>
      <div className="sliders">
        <ValueSlider
          value={position.x}
          min={-7}
          max={7}
          label="x"
          handleChange={moveX}
        />
        <ValueSlider
          value={position.y}
          min={0}
          max={3}
          label="y"
          handleChange={moveY}
        />
        <ValueSlider
          value={position.z}
          min={-7}
          max={7}
          label="z"
          handleChange={moveZ}
        />
        <ValueSlider
          value={rotation.y}
          min={-Math.PI}
          max={Math.PI}
          icon={<FlipCameraAndroid style={{ fontSize: '18px' }} />}
          handleChange={rotateY}
        />
      </div>
    </div>
  );
}

export default ModelSliders;
