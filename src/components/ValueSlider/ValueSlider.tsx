import { Slider } from '@mui/material';

import './ValueSlider.css';

export function ValueSlider({
  value,
  label,
  handleChange,
}: {
  value: number;
  label: string;
  handleChange: (event: Event, newValue: number | number[]) => void;
}): JSX.Element {
  return (
    <div className="slider-container">
      <p className="axis-label">{label}</p>
      <Slider
        className="slider"
        onChange={handleChange}
        min={-3}
        max={3}
        step={0.1}
        value={value || 0} // prevents the slider from being uncontrolled
        valueLabelDisplay="auto"
      />
      <p className="value-label">{value}</p>
    </div>
  );
}
