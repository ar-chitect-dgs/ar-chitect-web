/* eslint-disable jsx-a11y/no-static-element-interactions */
// todo for the future^
import { useCallback } from 'react';
import { useAppDispatch } from '../../redux';
import {
  Axis, changeActiveState, changeHoveredState, moveObject,
} from '../../redux/slices/scene';
import { SceneObject } from '../../types/Scene';
import { positionToString } from '../../utils/utils';
import { PositionSlider } from '../positionSlider/PositionSlider';

import './Properties.css';

function Properties({ object }: { object: SceneObject }): JSX.Element {
  const dispatch = useAppDispatch();

  const {
    id, name, hovered, active,
  } = object;
  const pos = object.position;

  const handleChangeX = useCallback((_event: Event, newValue: number | number[]) => {
    dispatch(moveObject(id, newValue as number, Axis.X));
  }, []);
  const handleChangeY = useCallback((_event: Event, newValue: number | number[]) => {
    dispatch(moveObject(id, newValue as number, Axis.Y));
  }, []);
  const handleChangeZ = useCallback((_event: Event, newValue: number | number[]) => {
    dispatch(moveObject(id, newValue as number, Axis.Z));
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
        {positionToString(pos)}
      </div>
      {active ? (
        <div className="sliders" onClick={(e) => e.stopPropagation()}>
          <PositionSlider value={pos.x} label="x" handleChange={handleChangeX} />
          <PositionSlider value={pos.y} label="y" handleChange={handleChangeY} />
          <PositionSlider value={pos.z} label="z" handleChange={handleChangeZ} />
        </div>
      ) : <></>}
    </div>
  );
}

export default Properties;
