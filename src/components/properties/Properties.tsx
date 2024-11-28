/* eslint-disable jsx-a11y/no-static-element-interactions */
// todo for the future^
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux';
import {
  addModel,
  Axis,
  moveObject,
  rotateObject,
  sceneSelector,
} from '../../redux/slices/scene';
import { positionToString } from '../../utils/utils';
import FilledButton from '../filledButton/FilledButton';
import { ValueSlider } from '../valueSlider/ValueSlider';

import './Properties.css';

function Properties(): JSX.Element {
  const dispatch = useAppDispatch();
  const { scene } = useSelector(sceneSelector);

  const id = scene.selectedObjectId;

  const moveX = useCallback((_event: Event, newValue: number | number[]) => {
    if (id === null) return;
    dispatch(moveObject(id, newValue as number, Axis.X));
  }, [id]);
  const moveY = useCallback((_event: Event, newValue: number | number[]) => {
    if (id === null) return;
    dispatch(moveObject(id, newValue as number, Axis.Y));
  }, [id]);
  const moveZ = useCallback((_event: Event, newValue: number | number[]) => {
    if (id === null) return;
    dispatch(moveObject(id, newValue as number, Axis.Z));
  }, [id]);

  const rotateY = useCallback((_event: Event, newValue: number | number[]) => {
    if (id === null) return;
    dispatch(rotateObject(id, newValue as number, Axis.Y));
  }, [id]);

  const copyObject = useCallback(() => {
    if (id === null) return;
    const {
      objectId, name, color, url,
    } = scene.objects[id];
    dispatch(addModel(objectId, name, color, url));
  }, [id]);

  if (id === null) {
    return <div />;
  }

  const {
    name, position, rotation,
  } = scene.objects[id];

  return (
    <div
      className="container"
    >
      <div className="name">
        {name}
      </div>
      <div className="position">
        {positionToString(position)}
      </div>
      <div className="sliders">
        <ValueSlider value={position.x} label="x" handleChange={moveX} />
        <ValueSlider value={position.y} label="y" handleChange={moveY} />
        <ValueSlider value={position.z} label="z" handleChange={moveZ} />
        <ValueSlider value={rotation.y} label="roty" handleChange={rotateY} />
      </div>
      <div className="button-panel">
        <FilledButton onClick={copyObject}>Copy</FilledButton>
        <FilledButton>Delete</FilledButton>
      </div>
    </div>
  );
}

export default Properties;
