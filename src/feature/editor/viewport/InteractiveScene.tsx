import { useThree } from '@react-three/fiber';
import { useGesture } from '@use-gesture/react';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import { useAppDispatch } from '../../../redux';
import {
  sceneSelector, moveObjectTo,
  activateObject, disactivateObject,
  rotateObject, Axis,
  hoverObject,
  unhoverObject,
} from '../../../redux/slices/scene';
import {
  Floor, Walls, Model, Ground,
  RAYCASTER_MODEL,
  RAYCASTER_GROUND,
} from '../../3dUtils';
import { Point2D } from '../../../types/Point';

const EPS = 0.7;

// todo move
function distanceToSegment(point: THREE.Vector2, v: THREE.Vector2, u: THREE.Vector2): number {
  const l2 = v.distanceToSquared(u);
  if (l2 === 0) return point.distanceTo(v);
  const t = Math.max(0, Math.min(1, point.clone().sub(v).dot(u.clone().sub(v)) / l2));
  const projection = v.clone().add(u.clone().sub(v).multiplyScalar(t));
  return point.distanceTo(projection);
}

function snapObject(position: THREE.Vector2, corners: Point2D[]): {
  position: THREE.Vector2,
  rotation: number,
} {
  let ret = position;
  let minDistance = Infinity;

  let closestWallIndex = -1;

  for (let i = 0; i < corners.length; i += 1) {
    const v = new THREE.Vector2(corners[i].x, corners[i].y);
    const u = new THREE.Vector2(
      corners[(i + 1) % corners.length].x,
      corners[(i + 1) % corners.length].y,
    );
    const distance = distanceToSegment(position, v, u);

    if (distance < minDistance && distance < EPS) {
      minDistance = distance;
      closestWallIndex = i;
    }
  }

  if (closestWallIndex === -1) {
    return { position, rotation: 0 };
  }

  const i = closestWallIndex;
  const v = new THREE.Vector2(corners[i].x, corners[i].y);
  const u = new THREE.Vector2(
    corners[(i + 1) % corners.length].x,
    corners[(i + 1) % corners.length].y,
  );

  const segmentVector = u.clone().sub(v);

  ret = v.clone().lerp(
    u,
    Math.max(
      0,
      Math.min(
        1,
        position.clone().sub(v).dot(segmentVector) / v.distanceToSquared(u),
      ),
    ),
  );
  ret.multiplyScalar(0.83);

  const normal = new THREE.Vector2(-segmentVector.y, segmentVector.x);
  // const xVector = new THREE.Vector2(1, 0);
  return { position: ret, rotation: Math.PI - normal.angle() };
}

export function InteractiveScene(): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const { raycaster } = useThree();
  const { scene } = useSelector(sceneSelector);
  const dispatch = useAppDispatch();
  const [dragging, setDragging] = useState(false);

  const intersectionAction = (
    hitAction: (i: THREE.Intersection) => boolean,
    missedAction?: () => void,
  ) => () => {
    const intersections = raycaster.intersectObjects([meshRef.current as THREE.Object3D]);

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
      if (intersection.object.userData.name === RAYCASTER_MODEL) {
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
      if (intersection.object.userData.name === RAYCASTER_GROUND) {
        const { point } = intersection;

        // todo not sure which component should handle this
        const { position, rotation } = snapObject(
          new THREE.Vector2(point.x, point.z), scene.corners,
        );

        dispatch(moveObjectTo(
            scene.activeObjectId as number,
            position.x,
            position.y,
        ));

        dispatch(rotateObject(scene.activeObjectId as number, rotation, Axis.Y));
        return true;
      }
      return false;
    },
  );

  const setActive = intersectionAction(
    (intersection: THREE.Intersection) => {
      if (intersection.object.userData.name === RAYCASTER_MODEL) {
        const { id } = intersection.object.userData;

        dispatch(activateObject(id));

        return true;
      }
      return false;
    },
    () => dispatch(disactivateObject()),
  );

  const rotate = intersectionAction(
    (intersection: THREE.Intersection) => {
      if (scene.activeObjectId == null) return false;

      if (intersection.object.userData.name === RAYCASTER_GROUND) {
        const { point } = intersection;

        const { position } = scene.objects[scene.activeObjectId];
        const { x, z } = position;

        const vector1 = new THREE.Vector2(point.x - x, point.z - z);
        const vector2 = new THREE.Vector2(1, 0);

        const angle = -vector2.angleTo(vector1) * Math.sign(point.z - z);

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
      setActive();
    },

    onMove: ({ event }) => {
      event.stopPropagation();
      if (dragging) return;

      if (scene.activeObjectId != null) move();
      else hover();
    },
  }, {
    drag: {
      filterTaps: true,
    },
  });

  return (
    <mesh
      ref={meshRef}
      {...bind() as any}
    >
      <Floor points={scene.corners} />
      <Walls points={scene.corners} closed />
      <Ground />

      {Object.values(scene.objects).map((model) => (
        <Model
          inProjectId={model.inProjectId}
          color={model.color}
          key={model.inProjectId}
          url={model.url}
          position={model.position}
          rotation={model.rotation}
          objectId={model.objectId}
          name={model.name || ''}
          hovered={model.inProjectId === scene.hoveredObjectId}
          active={model.inProjectId === scene.activeObjectId}
        />
      ))}

    </mesh>
  );
}
