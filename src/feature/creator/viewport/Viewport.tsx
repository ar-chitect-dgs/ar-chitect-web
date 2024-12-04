/* eslint-disable react/no-unknown-property */
import { OrbitControls } from '@react-three/drei';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux';
import {
  addPointToPlane, changeInteractionState, creatorSelector, Interaction,
} from '../../../redux/slices/creator';
import { Point2D } from '../../../types/Point';
import { arePointsClose } from '../../../utils/utils';
import { Floor } from '../../3dutils/Floor';
import { Ground } from '../../3dutils/Ground';
import { Vertices } from '../../3dutils/RoomCorners';
import { Sphere, SphereType } from '../../3dutils/Sphere';
import { Walls } from '../../3dutils/Walls';

function CreatorViewport(): JSX.Element {
  const dispatch = useAppDispatch();
  const { points, interaction } = useSelector(creatorSelector);
  const [previewPoint, setPreviewPoint] = useState<Point2D>({ x: 0, y: 0 });
  const [polygon, setPolygon] = useState<Point2D[]>([]);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (interaction !== Interaction.AddingVertex) return;

    const { point } = e.intersections[0];

    if (polygon.length > 2 && arePointsClose({ x: point.x, y: point.z }, polygon[0])) {
      dispatch(changeInteractionState(Interaction.Idle));
      return;
    }

    dispatch(addPointToPlane(point.x, point.z));
  };

  const onHover = (e: ThreeEvent<MouseEvent>) => {
    const { point } = e.intersections[0];
    setPreviewPoint({ x: point.x, y: point.z });
  };

  useEffect(() => {
    setPolygon([...points]);
  }, [points]);

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
      {interaction !== Interaction.AddingVertex
        && <Floor points={polygon} />}
      <Walls points={polygon} closed={interaction !== Interaction.AddingVertex} />
      <Vertices points={polygon} preview={previewPoint} />
      <Ground onClick={onClick} onHover={onHover} />
      {interaction === Interaction.AddingVertex
        && <Sphere key="preview" position={previewPoint} type={SphereType.Preview} />}

      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

      <OrbitControls
        enablePan={false}
        enableRotate={false}
        zoomSpeed={0.5}
        minDistance={5}
        maxDistance={50}
      />
    </Canvas>
  );
}

export default CreatorViewport;
