/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-props-no-spreading */
import { CircularProgress } from '@mui/material';
import { CameraControls, ContactShadows, Stats } from '@react-three/drei';
import {
  Canvas, useThree,
} from '@react-three/fiber';
import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import { useGesture } from '@use-gesture/react';
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
} from '../../../redux/slices/scene';
import {
  Floor, Ground, Model,
  Walls,
} from '../../3dUtils';
import { RAYCASTER_GROUND } from '../../3dUtils/Ground';
import { MODEL_TYPE } from '../../3dUtils/Model';

function Scene(): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const { raycaster } = useThree();
  const { scene } = useSelector(sceneSelector);
  const dispatch = useAppDispatch();
  const [drag, setDrag] = useState(false);

  const hover = () => {
    const intersections = raycaster.intersectObjects([meshRef.current as THREE.Object3D]);

    let hit = false;

    for (let i = 0; i < intersections.length; i += 1) {
      const intersection = intersections[i];

      if (intersection.object.userData == null) return;

      if (intersection.object.userData.name === MODEL_TYPE) {
        const { id } = intersection.object.userData;

        dispatch(hoverObject(id));
        hit = true;
        // break;
      }
    }

    if (!hit) {
      dispatch(unhoverObject());
    }
  };

  const move = () => {
    const intersections = raycaster.intersectObjects([meshRef.current as THREE.Object3D]);

    if (scene.activeObjectId == null) return;

    for (let i = 0; i < intersections.length; i += 1) {
      const intersection = intersections[i];

      if (intersection.object.userData == null) return;

      if (intersection.object.userData.name === RAYCASTER_GROUND) {
        const { point } = intersection;

        dispatch(moveObjectTo(
          scene.activeObjectId as number,
          point.x,
          point.z,
        ));
        break;
      }
    }
  };

  const setActive = () => {
    const intersections = raycaster.intersectObjects([meshRef.current as THREE.Object3D]);

    let hit = false;

    for (let i = 0; i < intersections.length; i += 1) {
      const intersection = intersections[i];

      if (intersection.object.userData
      && intersection.object.userData.name === MODEL_TYPE) {
        const { id } = intersection.object.userData;

        dispatch(activateObject(id));
        hit = true;
        break;
      }
    }

    if (!hit) {
      dispatch(disactivateObject());
    }
  };

  const rotate = () => {
    const intersections = raycaster.intersectObjects([meshRef.current as THREE.Object3D]);

    intersections.forEach((intersection) => {
      if (intersection.object.userData
          && intersection.object.userData.name === RAYCASTER_GROUND) {
        const { point } = intersection;

        if (scene.activeObjectId == null) return;

        const { position } = scene.objects[scene.activeObjectId];
        const { x, z } = position;

        const vector1 = new THREE.Vector2(point.x - x, point.z - z);
        const vector2 = new THREE.Vector2(1, 0);

        const angle = -vector2.angleTo(vector1) * Math.sign(point.z - z);

        dispatch(rotateObject(scene.activeObjectId, angle, Axis.Y));
      }
    });
  };

  const bind = useGesture({
    onDrag: ({ event, tap }) => {
      event.stopPropagation();
      if (tap) return;
      rotate();
      setDrag(true);
    },
    onDragEnd: ({ event, tap }) => {
      event.stopPropagation();
      if (tap) return;
      dispatch(disactivateObject());
      setTimeout(() => setDrag(false), 100);
    },
    onClick: ({ event, dragging }) => {
      event.stopPropagation();
      if (drag) return;

      setActive();
    },
    onMove: ({ event, dragging }) => {
      event.stopPropagation();
      hover();

      if (drag) return;
      move();
    },
  }, {
    drag: {
      filterTaps: true,
      delay: 1000,
    },
  });

  return (
    <mesh
      ref={meshRef}
      {...bind() as any}
    >
      <Floor points={scene.corners} />
      <Walls points={scene.corners} closed />

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
          hovered={model.hovered}
          active={model.active}
        />
      ))}

      <Ground />
    </mesh>
  );
}

function EditorViewport(): JSX.Element {
  const { scene } = useSelector(sceneSelector);
  const cameraControlRef = useRef<CameraControls | null>(null);

  useEffect(() => {
    if (scene.activeObjectId != null) {
      document.body.style.cursor = 'grabbing';
    } else if (scene.hoveredObjectId != null) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'auto';
    }
  }, [scene.activeObjectId, scene.hoveredObjectId]);

  return (
    <Suspense fallback={<CircularProgress />}>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 2000,
          position: [5, 5, 5],
        }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <CameraControls
          ref={cameraControlRef}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2}
          mouseButtons={{
            left: 0,
            middle: 1,
            right: 2,
            wheel: 8,
          }}
        />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

        <Scene />
        <ContactShadows scale={10} blur={3} opacity={0.25} far={10} />
        <Stats />
      </Canvas>
    </Suspense>
  );
}

export default EditorViewport;
