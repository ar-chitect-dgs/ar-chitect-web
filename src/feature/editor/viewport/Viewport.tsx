/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-props-no-spreading */
import { CircularProgress } from '@mui/material';
import { CameraControls } from '@react-three/drei';
import {
  Canvas,
} from '@react-three/fiber';
import {
  Suspense, useRef,
} from 'react';
import { InteractiveScene } from './InteractiveScene';

function EditorViewport(): JSX.Element {
  const cameraControlRef = useRef<CameraControls | null>(null);

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
        <ambientLight intensity={2} />
        <pointLight position={[0, 2, 0]} rotation={[0, 0, 0]} decay={0} intensity={3} />

        <InteractiveScene />
      </Canvas>
    </Suspense>
  );
}

export default EditorViewport;
