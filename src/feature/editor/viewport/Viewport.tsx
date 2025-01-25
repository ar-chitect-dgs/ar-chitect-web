/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-props-no-spreading */
import { CircularProgress } from '@mui/material';
import { CameraControls } from '@react-three/drei';
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
        gl={{ antialias: true }}
        tabIndex={0}
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
        <ambientLight intensity={0} />
        <pointLight position={[0, 2, 0]} decay={0} intensity={3} />

        <InteractiveScene />
      </Canvas>
    </Suspense>
  );
}

export default EditorViewport;
