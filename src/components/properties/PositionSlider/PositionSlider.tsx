import { Slider } from "@mui/material";

import "./PositionSlider.css";

export function PositionSlider(props: {
  value: number,
  label: string,
  handleChange: (event: Event, newValue: number | number[]) => void
}) {
  return (
    <div className="slider-container">
      <p className="axis-label">{props.label}</p>
      <Slider className="slider"
        onChange={props.handleChange}
        min={-3}
        max={3}
        step={0.1}
        defaultValue={props.value}
        valueLabelDisplay="auto"
      />
      <p className={"value-label"}>{props.value}</p>
    </div>
  )
}
