import { useState } from 'react';
import { ApiModel } from '../../api/types';
import './ModelTile.css';

export interface SelectedModel {
    id: string;
    name: string;
    url: string;
    color: string;
}

interface ModelTileProps {
  model: ApiModel;
  onClick: (model: SelectedModel) => void;
}

const MAP_COLORS = {
  creme: '#edc1a6',
  brown: '#7a3c15',
  dark_brown: '#2e1505',
  default: '#a0cdfa',
  grey: '#808080',
  white: '#FFF',

};

const ModelTile = ({ model, onClick }: ModelTileProps): JSX.Element => {
  console.log('color variants', model.colorVariants);
  const colorOptions = Object.keys(model.colorVariants);
  const [selectedColor, setSelectedColor] = useState(
    colorOptions.findIndex((e) => e === 'default') === -1 ? colorOptions[0] : 'default',
  );

  const modelToSelectedModel = (model: ApiModel): SelectedModel => ({
    id: model.id,
    name: model.name,
    url: model.colorVariants[selectedColor]?.modelUrl,
    color: selectedColor,
  });

  return (
    <div className="model-tile">
      <button
        onClick={() => onClick(modelToSelectedModel(model))}
        className="model-button"
        type="button"
      >
        <img
          src={model.colorVariants[selectedColor]?.thumb}
          alt={`${model.name} thumbnail`}
          className="model-thumbnail"
        />
      </button>
      <div className="color-selector">
        {colorOptions.map((color) => (
          <button
            key={color}
            type="button"
            aria-label="color option"
            className={`color-option ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: MAP_COLORS[color as keyof typeof MAP_COLORS] }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ModelTile;
