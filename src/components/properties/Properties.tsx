import { useCallback } from 'react';
import { SceneObject } from '../../types/Scene';
import './Properties.css';
import { Axis, moveObject } from '../../slices/scene';
import { useAppDispatch } from '../../redux';
import { positionToString } from '../../utils/utils';
import { PositionSlider } from './PositionSlider/PositionSlider';

function Properties({ object }: { object: SceneObject }): JSX.Element {
  const dispatch = useAppDispatch();

  const { id } = object;
  const { name } = object;
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

  return (
    <div className="container">
      <div className="name">
        {name}
      </div>
      <div className="position">
        {positionToString(pos)}
      </div>
      <PositionSlider value={pos.x} label="x" handleChange={handleChangeX} />
      <PositionSlider value={pos.y} label="y" handleChange={handleChangeY} />
      <PositionSlider value={pos.z} label="z" handleChange={handleChangeZ} />
    </div>
  );
}

export default Properties;
