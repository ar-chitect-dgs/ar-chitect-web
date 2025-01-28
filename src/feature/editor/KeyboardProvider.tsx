import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  addModel,
  Axis, deleteModel, disactivateObject, moveObject, rotateObject, sceneSelector,
  toggleSnapping,
} from '../../redux/slices/editor';
import { EditorAction } from '../../types/KeyBinds';
import { round } from '../../utils/utils';
import { settingsSelector } from '../../redux/slices/settings';
import { useAppDispatch } from '../../redux';

export function KeyboardProvider({ children }: { children: ReactNode }): JSX.Element {
  const { scene } = useSelector(sceneSelector);
  const { keyBinds } = useSelector(settingsSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const id = scene.activeObjectId;

      if (id === null) return;

      const step = 0.1;
      const roundPosition = (value: number) => round(value, 1);

      let { key } = event;
      if (event.key.length === 1) key = event.key.toUpperCase();

      switch (key) {
        case keyBinds[EditorAction.DELETE]:
          dispatch(deleteModel(id));
          break;
        case keyBinds[EditorAction.COPY]:
          // eslint-disable-next-line no-case-declarations
          const {
            objectId, name, color, url,
          } = scene.objects[id];
          dispatch(addModel(objectId, name, color, url));
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
        case keyBinds[EditorAction.ROTATE_CW]:
          dispatch(
            rotateObject(
              id,
              scene.objects[id].rotation.y - step,
              Axis.Y,
            ),
          );
          break;
        case keyBinds[EditorAction.ROTATE_CCW]:
          dispatch(
            rotateObject(
              id,
              scene.objects[id].rotation.y + step,
              Axis.Y,
            ),
          );
          break;
        case keyBinds[EditorAction.DESELECT]:
          dispatch(disactivateObject());
          break;
        case keyBinds[EditorAction.NO_SNAP]:
          dispatch(toggleSnapping());
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scene.activeObjectId, scene.objects, dispatch]);

  return <>{children}</>;
}
