/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-props-no-spreading */
import { Grid } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

function Ground() {
  const gridConfig = {
    cellSize: 0.25,
    cellThickness: 1,
    cellColor: '#6f6f6f',
    sectionSize: 0.5,
    sectionThickness: 1,
    sectionColor: '#595959',
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };
  return <Grid position={[0, 0, 0]} {...gridConfig} />;
}

function CreatorViewport(): JSX.Element {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 2000,
        position: [0, 10, 0],
        rotation: [-Math.PI / 2, 0, 0],
      }}
      gl={{ antialias: true }}
      scene={{}}
    >
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Ground />
    </Canvas>
  );
}

export default CreatorViewport;
