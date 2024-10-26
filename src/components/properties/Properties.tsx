import { Slider } from '@mui/material';
import { Object } from '../../types/Scene';
import './Properties.css';
import { moveObject } from '../../slices/scene';
import { useAppDispatch } from '../..';

interface PropertiesProps {
  object: Object
}

function Properties({ object }: PropertiesProps) {
  const dispatch = useAppDispatch();

  function handleChange(event: Event, newValue: number | number[]) {
    console.log("hii")
    dispatch(moveObject(object.id, newValue as number))
  }

  return (
    <div className="container">
      <div className="name">
        {object.name}
      </div>
      <div className="position">
        {object.position.toString()}
      </div>
      <div className="slider">
        <Slider onChange={handleChange} min={-3} max={3} step={0.1} />
      </div>
    </div>
  )
}

export default Properties