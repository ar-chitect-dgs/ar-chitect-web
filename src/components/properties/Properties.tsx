import { Object } from '../../types/Scene';
import './Properties.css';

interface PropertiesProps {
  object: Object
}

function Properties({ object }: PropertiesProps) {
  // function handleChange(event: Event, newValue: number | number[]) {

  // }

  return (
    <div className="container">
      <div className="name">
        {object.name}
      </div>
      <div className="position">
        {object.position.toString()}
      </div>
      <div className="slider">
        {/* <Slider onChange={handleChange} /> */}
      </div>
    </div>
  )
}

export default Properties