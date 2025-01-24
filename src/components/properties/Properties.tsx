import { FlipCameraAndroid } from '@mui/icons-material';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux';
import {
  addModel,
  Axis,
  deleteModel,
  disactivateObject,
  moveObject,
  rotateObject,
  sceneSelector,
} from '../../redux/slices/scene';
import { positionToString, round } from '../../utils/utils';
import FilledButton from '../filledButton/FilledButton';

import { settingsSelector } from '../../redux/slices/settings';
import { EditorAction } from '../../types/KeyBinds';
import { ValueSlider } from '../valueSlider/ValueSlider';
import './Properties.css';

function Properties(): JSX.Element {
  const dispatch = useAppDispatch();
  const { scene } = useSelector(sceneSelector);
  const { keyBinds, useEditorSliders } = useSelector(settingsSelector);

  const id = scene.activeObjectId;

  const moveX = useCallback(
    (_event: Event, newValue: number | number[]) => {
      if (id === null) return;
      dispatch(moveObject(id, newValue as number, Axis.X));
    },
    [id],
  );
  const moveY = useCallback(
    (_event: Event, newValue: number | number[]) => {
      if (id === null) return;
      dispatch(moveObject(id, newValue as number, Axis.Y));
    },
    [id],
  );
  const moveZ = useCallback(
    (_event: Event, newValue: number | number[]) => {
      if (id === null) return;
      dispatch(moveObject(id, newValue as number, Axis.Z));
    },
    [id],
  );

  const rotateY = useCallback(
    (_event: Event, newValue: number | number[]) => {
      if (id === null) return;
      dispatch(rotateObject(id, newValue as number, Axis.Y));
    },
    [id],
  );

  const copyObject = useCallback(() => {
    if (id === null) return;
    const {
      objectId, name, color, url,
    } = scene.objects[id];
    dispatch(addModel(objectId, name, color, url));
  }, [id]);

  const deleteObject = useCallback(() => {
    if (id === null) return;
    dispatch(deleteModel(id));
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (id === null) return;

      const step = 0.1;
      const roundPosition = (value: number) => round(value, 1);

      let { key } = event;
      if (event.key.length === 1) key = event.key.toUpperCase();

      switch (key) {
        case keyBinds[EditorAction.DELETE]:
          deleteObject();
          break;
        case keyBinds[EditorAction.COPY]:
          copyObject();
          break;
        case keyBinds[EditorAction.MOVE_LEFT]:
          dispatch(
            moveObject(
              id,
              roundPosition(scene.objects[id].position.x - step),
              Axis.X,
            ),
          );
          break;
        case keyBinds[EditorAction.MOVE_RIGHT]:
          dispatch(
            moveObject(
              id,
              roundPosition(scene.objects[id].position.x + step),
              Axis.X,
            ),
          );
          break;
        case keyBinds[EditorAction.MOVE_BACK]:
          dispatch(
            moveObject(
              id,
              roundPosition(scene.objects[id].position.z - step),
              Axis.Z,
            ),
          );
          break;
        case keyBinds[EditorAction.MOVE_FRONT]:
          dispatch(
            moveObject(
              id,
              roundPosition(scene.objects[id].position.z + step),
              Axis.Z,
            ),
          );
          break;
        case keyBinds[EditorAction.MOVE_DOWN]:
          dispatch(
            moveObject(
              id,
              roundPosition(scene.objects[id].position.y - step),
              Axis.Y,
            ),
          );
          break;
        case keyBinds[EditorAction.MOVE_UP]:
          dispatch(
            moveObject(
              id,
              roundPosition(scene.objects[id].position.y + step),
              Axis.Y,
            ),
          );
          break;
        case keyBinds[EditorAction.DESELECT]:
          dispatch(disactivateObject());
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [id, scene.objects, dispatch]);

  if (id === null) {
    return <div />;
  }

  const { name, position, rotation } = scene.objects[id];

  return (
    <div className="container">
      <div className="name">{name}</div>
      {useEditorSliders
        && (
          <>
            <div className="position">{positionToString(position)}</div>
            <div className="sliders">
              <ValueSlider value={position.x} min={-20} max={20} label="x" handleChange={moveX} />
              <ValueSlider value={position.y} min={0} max={3} label="y" handleChange={moveY} />
              <ValueSlider value={position.z} min={-20} max={20} label="z" handleChange={moveZ} />
              <ValueSlider
                value={rotation.y}
                min={-20}
                max={20}
                icon={<FlipCameraAndroid />}
                handleChange={rotateY}
              />
            </div>
          </>
        )}
      <div className="button-panel">
        <FilledButton onClick={copyObject}>Copy</FilledButton>
        <FilledButton onClick={deleteObject} className="delete-obj-button">
          Delete
        </FilledButton>
      </div>
    </div>
  );
}

export default Properties;
