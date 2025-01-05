/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-props-no-spreading */
import { CameraControls, ContactShadows } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  sceneSelector,
} from '../../../redux/slices/scene';
import {
  Floor, Ground, Model, Walls,
} from '../../3dUtils';

function EditorViewport(): JSX.Element {
  const { scene } = useSelector(sceneSelector);
  const cameraControlRef = useRef<CameraControls | null>(null);

  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 2000,
        position: [5, 5, 5],
      }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      scene={{}}
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
      <directionalLight intensity={2} position={[0, 1, 0]} />
      <spotLight position={[0, 5, 0]} />
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
      <ContactShadows scale={10} blur={3} opacity={0.25} far={10} />
    </Canvas>
  );
}

export default EditorViewport;
