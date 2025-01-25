import { Slider } from '@mui/material';

import './ValueSlider.css';

interface ValueSliderProps {
  value: number;
  min: number;
  max: number;
  label?: string;
  icon?: JSX.Element;
  handleChange: (event: Event, newValue: number | number[]) => void;
}

export function ValueSlider({
  value,
  min,
  max,
  label,
  icon,
  handleChange,
}: ValueSliderProps): JSX.Element {
  return (
    <div className="slider-container">
      <p className="axis-label">{icon ?? label}</p>
      <Slider
        className="slider"
        onChange={handleChange}
        min={min}
        max={max}
        step={0.01}
        value={value || 0}
        valueLabelDisplay="auto"
        size="small"
      />
      <p className="value-label">{value.toFixed(1)}</p>
    </div>
  );
}
