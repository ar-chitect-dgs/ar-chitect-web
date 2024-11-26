/* eslint-disable jsx-a11y/no-static-element-interactions */
// todo for the future^
import { useCallback } from 'react';
import { SceneObject } from '../../types/Scene';
import './Properties.css';

import { Button } from '@mui/material';
import { useAppDispatch } from '../../redux';
import {
  Axis, changeActiveState, changeHoveredState,
  moveObject,
  rotateObject,
} from '../../redux/slices/scene';
import { positionToString } from '../../utils/utils';
import { ValueSlider } from '../ValueSlider/ValueSlider';

function Properties({ object }: { object: SceneObject }): JSX.Element {
  const dispatch = useAppDispatch();

  const {
    id, name, hovered, active, position, rotation,
  } = object;

  const moveX = useCallback((_event: Event, newValue: number | number[]) => {
    dispatch(moveObject(id, newValue as number, Axis.X));
  }, []);
  const moveY = useCallback((_event: Event, newValue: number | number[]) => {
    dispatch(moveObject(id, newValue as number, Axis.Y));
  }, []);
  const moveZ = useCallback((_event: Event, newValue: number | number[]) => {
    dispatch(moveObject(id, newValue as number, Axis.Z));
  }, []);

  const rotateX = useCallback((_event: Event, newValue: number | number[]) => {
    dispatch(rotateObject(id, newValue as number, Axis.X));
  }, []);
  const rotateY = useCallback((_event: Event, newValue: number | number[]) => {
    dispatch(rotateObject(id, newValue as number, Axis.Y));
  }, []);
  const rotateZ = useCallback((_event: Event, newValue: number | number[]) => {
    dispatch(rotateObject(id, newValue as number, Axis.Z));
  }, []);

  const handleHover = useCallback(() => {
    dispatch(changeHoveredState(id, true));
  }, []);
  const handleUnhover = useCallback(() => {
    dispatch(changeHoveredState(id, false));
  }, []);
  const handleClick = useCallback(() => {
    dispatch(changeActiveState(id));
  }, []);

  return (
    <div
      className={`container ${active ? 'active ' : ''}${hovered ? 'hovered ' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
    >
      <div className="name">
        {name}
      </div>
      <div className="position">
        {positionToString(position)}
      </div>
      {active ? (
        <div className="sliders" onClick={(e) => e.stopPropagation()}>
          <ValueSlider value={position.x} label="x" handleChange={moveX} />
          <ValueSlider value={position.y} label="y" handleChange={moveY} />
          <ValueSlider value={position.z} label="z" handleChange={moveZ} />
          <ValueSlider value={rotation.x} label="rotx" handleChange={rotateX} />
          <ValueSlider value={rotation.y} label="roty" handleChange={rotateY} />
          <ValueSlider value={rotation.z} label="rotz" handleChange={rotateZ} />
        </div>
      ) : <></>}
      <div className="buttonPanel">
        <Button
          className="button"
          variant="contained"
        >
          Copy
        </Button>
        <Button
          className="button"
          variant="contained"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default Properties;
