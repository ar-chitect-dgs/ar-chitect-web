/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-props-no-spreading */
import { CircularProgress } from '@mui/material';
import { CameraControls, ContactShadows, Stats } from '@react-three/drei';
import {
  Canvas,
  ThreeEvent,
} from '@react-three/fiber';
import {
  Suspense,
  useEffect,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import { useAppDispatch } from '../../../redux';
import {
  activateObject,
  Axis,
  disactivateObject,
  hoverObject,
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

function EditorViewport(): JSX.Element {
  const { scene } = useSelector(sceneSelector);
  const cameraControlRef = useRef<CameraControls | null>(null);
  const dispatch = useAppDispatch();
  // const { raycaster } = useThree();
  // const planeRef = useContext(PlaneContext);

  const handleHover = (e: ThreeEvent<MouseEvent>) => {
    let hit = false;

    for (let i = 0; i < e.intersections.length; i += 1) {
      const intersection = e.intersections[i];

      if (intersection.object.userData
      && intersection.object.userData.name === MODEL_TYPE) {
        const { id } = intersection.object.userData;

        dispatch(hoverObject(id));
        hit = true;
        break;
      }
    }

    if (!hit) {
      dispatch(unhoverObject());
    }
  };

  const setActive = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    let hit = false;

    for (let i = 0; i < e.intersections.length; i += 1) {
      const intersection = e.intersections[i];

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

  const handlePointerUp = (e: ThreeEvent<MouseEvent>) => {
    setActive(e);
  };

  const handlePointerDown = (e: ThreeEvent<MouseEvent>) => {
    setActive(e);
  };

  useEffect(() => {
    if (scene.activeObjectId != null) {
      document.body.style.cursor = 'grabbing';
    } else if (scene.hoveredObjectId != null) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'auto';
    }
  }, [scene.activeObjectId, scene.hoveredObjectId]);

  // todo move these to viewport
  // see this along with comment https://stackoverflow.com/questions/75466281/three-js-drag-a-model-on-x-and-z-axis-react-three-fiber
  const handlePointerMove = (e: ThreeEvent<MouseEvent>) => {
    e.intersections.forEach((intersection) => {
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

        // dispatch(moveObjectTo(
        //     scene.activeObjectId as number,
        //     point.x,
        //     point.z,
        // ));
      }
    });
  };

  // const bind = useGesture({
  //   onDrag: () => {
  //     const intersects = raycaster.intersectObjects([planeRef]);
  //     if (intersects.length > 0) {
  //       const intersection = intersects[0];
  //       console.log(intersection.point.x);
  //       setBoxPosition({
  //         x: intersection.point.x,
  //         y: intersection.point.y,
  //         z: intersection.point.z,
  //       });
  //     }
  //     setControlsDisabled(true);
  //   },
  //   onDragEnd: () => {
  //     setControlsDisabled(false);
  //   },
  // });

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
            left: 1,
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

        <mesh
          onPointerMove={handleHover}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
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
          <Ground onPointerMove={handlePointerMove} />
        </mesh>

        <ContactShadows scale={10} blur={3} opacity={0.25} far={10} />
        <Stats />
      </Canvas>
    </Suspense>
  );
}

export default EditorViewport;
