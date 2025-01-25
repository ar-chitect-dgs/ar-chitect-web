/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-props-no-spreading */
import { CircularProgress } from '@mui/material';
import {
  CameraControls, ContactShadows, Stats,
} from '@react-three/drei';
import {
  Canvas,
} from '@react-three/fiber';
import {
  Suspense,
  useEffect,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import {
  sceneSelector,
} from '../../../redux/slices/scene';
import { InteractiveScene } from './InteractiveScene';

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
  }, [scene.hoveredObjectId, scene.activeObjectId]);

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
        tabIndex={0}
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

        <InteractiveScene />
        <ContactShadows scale={10} blur={3} opacity={0.25} far={10} />
        <Stats />
      </Canvas>
    </Suspense>
  );
}

export default EditorViewport;
