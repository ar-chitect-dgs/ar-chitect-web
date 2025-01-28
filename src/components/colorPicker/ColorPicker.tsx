import React from 'react';
import { MuiColorInput } from 'mui-color-input';
import { Button } from '@mui/material';
import RestoreRounded from '@mui/icons-material/RestoreRounded';
import './ColorPicker.css';

interface ColorPickerProps {
  label: string;
  colorValue: string;
  onChangeColor: (color: string) => void;
  onResetColor: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  colorValue,
  onChangeColor,
  onResetColor,
}) => (
  <div className="color-input">
    <p className="color-label">{label}</p>
    <MuiColorInput
      format="hex"
      value={colorValue}
      isAlphaHidden
      sx={{ margin: '0' }}
      onChange={onChangeColor}
    />
    <Button className="color-restore" onClick={onResetColor}>
      <RestoreRounded />
    </Button>
  </div>
);

export default ColorPicker;
