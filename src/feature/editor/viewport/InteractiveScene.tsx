import { useFrame, useThree } from '@react-three/fiber';
import { useGesture } from '@use-gesture/react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import { useAppDispatch } from '../../../redux';
import {
  activateObject,
  Axis,
  disactivateObject,
  hoverObject,
  moveObjectTo,
  rotateObject,
  sceneSelector,
  unhoverObject,
  Interaction,
  addModel,
  changeInteractionState,
  deleteModel,
} from '../../../redux/slices/editor';
import { settingsSelector } from '../../../redux/slices/settings';
import { snapObject } from '../../../utils/utils';
import {
  Floor,
  Ground,
  GROUND,
  Model,
  MODEL,
  Walls,
} from '../../3dUtils';

export function InteractiveScene(): JSX.Element {
  const sceneRef = useRef<THREE.Mesh>(null);
  const { raycaster } = useThree();
  const { scene, interaction, snapToWalls } = useSelector(sceneSelector);
  const { useEditorSliders } = useSelector(settingsSelector);
  const dispatch = useAppDispatch();
  const [dragging, setDragging] = useState(false);
  const [activeModelDepth, setActiveModelDepth] = useState(0);
  const [renderWallsToggle, setRenderWallsToggle] = useState(false);

  useEffect(() => {
    switch (interaction) {
      case Interaction.Idle:
        if (scene.activeObjectId != null && !useEditorSliders) {
          document.body.style.cursor = 'grabbing';
        } else if (scene.hoveredObjectId != null && !useEditorSliders) {
          document.body.style.cursor = 'grab';
        } else if (scene.hoveredObjectId != null && useEditorSliders) {
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'auto';
        }

        break;

      case Interaction.Copy:
        document.body.style.cursor = 'copy';
        break;

      case Interaction.Delete:
        if (scene.hoveredObjectId != null) {
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'auto';
        }
        break;

      default:
    }
  }, [scene.activeObjectId, scene.hoveredObjectId,
    interaction, useEditorSliders]);

  useFrame(() => {
    setRenderWallsToggle(!renderWallsToggle);
  });

  const intersectionAction = (
    hitAction: (i: THREE.Intersection) => boolean,
    missedAction?: () => void,
  ) => () => {
    const intersections = raycaster.intersectObjects([sceneRef.current as THREE.Object3D]);

    let hit = false;

    for (let i = 0; i < intersections.length; i += 1) {
      const intersection = intersections[i];

      if (intersection.object.userData == null) return;

      if (hitAction(intersection)) {
        hit = true;
        break;
      }
    }

    if (!hit && missedAction) {
      missedAction();
    }
  };

  const hover = intersectionAction(
    (intersection: THREE.Intersection) => {
      if (intersection.object.userData.name === MODEL) {
        const { id } = intersection.object.userData;

        dispatch(hoverObject(id));
        return true;
      }
      return false;
    },
    () => dispatch(unhoverObject()),
  );

  const move = intersectionAction(
    (intersection: THREE.Intersection) => {
      if (intersection.object.userData.name === GROUND) {
        const { point } = intersection;

        if (!snapToWalls) {
          dispatch(moveObjectTo(
            scene.activeObjectId as number,
            point.x,
            point.z,
          ));
          return true;
        }

        const { snapped, position, rotation } = snapObject(
          new THREE.Vector2(point.x, point.z), activeModelDepth, scene.corners,
        );

        if (snapped) {
          dispatch(rotateObject(scene.activeObjectId as number, rotation, Axis.Y));
        }

        dispatch(moveObjectTo(
            scene.activeObjectId as number,
            position.x,
            position.y,
        ));

        return true;
      }
      return false;
    },
  );

  const setActive = intersectionAction(
    (intersection: THREE.Intersection) => {
      if (intersection.object.userData.name === MODEL) {
        const { id } = intersection.object.userData;

        if (useEditorSliders) {
          if (id === scene.activeObjectId) {
            dispatch(disactivateObject());
          } else {
            dispatch(activateObject(id));
          }
        } else if (scene.activeObjectId !== null) {
          dispatch(disactivateObject());
        } else {
          dispatch(activateObject(id));
        }

        return true;
      }
      return false;
    },
    () => dispatch(disactivateObject()),
  );

  const copyObject = intersectionAction(
    (intersection: THREE.Intersection) => {
      if (intersection.object.userData.name === MODEL) {
        const { id } = intersection.object.userData;

        const {
          objectId, name, color, url,
        } = scene.objects[id];
        dispatch(addModel(objectId, name, color, url));

        return true;
      }
      return false;
    },
  );

  const deleteObject = intersectionAction(
    (intersection: THREE.Intersection) => {
      if (intersection.object.userData.name === MODEL) {
        const { id } = intersection.object.userData;

        dispatch(deleteModel(id));

        return true;
      }
      return false;
    },
  );

  const rotate = intersectionAction(
    (intersection: THREE.Intersection) => {
      if (scene.activeObjectId == null) return false;

      if (intersection.object.userData.name === GROUND) {
        const { point } = intersection;

        const { position } = scene.objects[scene.activeObjectId];
        const { x, z } = position;

        const vector1 = new THREE.Vector2(point.x - x, point.z - z);
        const vector2 = new THREE.Vector2(1, 0);

        const angle = -vector2.angleTo(vector1) * Math.sign(point.z - z) + Math.PI / 2;

        dispatch(rotateObject(scene.activeObjectId, angle, Axis.Y));
        return true;
      }
      return false;
    },
  );

  const bind = useGesture({
    onDrag: ({ event, tap }) => {
      event.stopPropagation();
      if (tap) return;

      setDragging(true);
      if (scene.activeObjectId != null) rotate();
    },

    onDragEnd: ({ event, tap }) => {
      event.stopPropagation();
      if (tap) return;

      dispatch(disactivateObject());
      setTimeout(() => setDragging(false), 100);
    },

    onClick: ({ event }) => {
      event.stopPropagation();
      if (dragging) return;

      switch (interaction) {
        case Interaction.Idle:
          setActive();
          break;

        case Interaction.Copy:
          copyObject();
          dispatch(changeInteractionState(Interaction.Idle));
          break;

        case Interaction.Delete:
          deleteObject();
          break;
        default:
      }
    },

    onMove: ({ event }) => {
      event.stopPropagation();
      if (dragging) return;

      if (scene.activeObjectId != null && !useEditorSliders) move();
      else hover();
    },
  }, {
    drag: {
      filterTaps: true,
    },
  });

  return (
    <mesh
      ref={sceneRef}
      {...bind() as any}
    >
      <Floor points={scene.corners} />
      <Walls points={scene.corners} closed _shouldRerender={renderWallsToggle} hide />
      <Ground />

      {Object.values(scene.objects).map((model) => (
        <Model
          inProjectId={model.inProjectId}
          key={model.inProjectId}
          color={model.color}
          url={model.url}
          position={model.position}
          rotation={model.rotation}
          objectId={model.objectId}
          name={model.name || ''}
          hovered={model.inProjectId === scene.hoveredObjectId}
          active={model.inProjectId === scene.activeObjectId}
          passDepthToParent={
            model.inProjectId === scene.activeObjectId
              ? setActiveModelDepth
              : undefined
            }
        />
      ))}

    </mesh>
  );
}
