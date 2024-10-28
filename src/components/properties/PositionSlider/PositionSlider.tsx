import { Slider } from '@mui/material';

import './PositionSlider.css';

export function PositionSlider({
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
        defaultValue={value}
        valueLabelDisplay="auto"
      />
      <p className="value-label">{value}</p>
    </div>
  );
}
