import { Object } from '../../types/Scene';
import './Properties.css';
import { Axis, moveObject } from '../../slices/scene';
import { useAppDispatch } from '../..';
import { positionToString } from '../../utils/utils';
import { PositionSlider } from './PositionSlider/PositionSlider';

function Properties(props: { object: Object }) {
  const dispatch = useAppDispatch();

  const id = props.object.id
  const name = props.object.name
  const pos = props.object.position

  function handleChangeX(event: Event, newValue: number | number[]) {
    dispatch(moveObject(id, newValue as number, Axis.X))
  }
  function handleChangeY(event: Event, newValue: number | number[]) {
    dispatch(moveObject(id, newValue as number, Axis.Y))
  }
  function handleChangeZ(event: Event, newValue: number | number[]) {
    dispatch(moveObject(id, newValue as number, Axis.Z))
  }

  return (
    <div className="container">
      <div className="name">
        {name}
      </div>
      <div className="position">
        {positionToString(pos)}
      </div>
      <PositionSlider value={pos.x} label={"x"} handleChange={handleChangeX} />
      <PositionSlider value={pos.y} label={"y"} handleChange={handleChangeY} />
      <PositionSlider value={pos.z} label={"z"} handleChange={handleChangeZ} />
    </div>
  )
}

export default Properties