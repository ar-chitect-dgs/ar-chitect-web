/* eslint-disable react/no-unknown-property */
import { OrbitControls } from '@react-three/drei';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux';
import {
  addPointToPlane, changeInteractionState, creatorSelector, deletePoint, Interaction,
  movePoint,
} from '../../../redux/slices/creator';
import { Point2D, Point3D } from '../../../types/Point';
import { arePointsClose } from '../../../utils/utils';
import {
  Floor, Ground,
  Sphere,
  SphereType, Walls,
} from '../../3dUtils';
import { RoomCorners } from '../../3dUtils/RoomCorners';

function CreatorViewport(): JSX.Element {
  const dispatch = useAppDispatch();
  const { points, interaction } = useSelector(creatorSelector);
  const [cursor, setCursor] = useState<Point2D>({ x: 0, y: 0 });
  const [polygon, setPolygon] = useState<Point2D[]>([]);
  const [clickedVertex, setClickedVertex] = useState(-1);

  useEffect(() => {
    setPolygon([...points]);
  }, [points]);

  const addVertex = (point: Point3D) => {
    if (polygon.length > 2 && arePointsClose({ x: point.x, y: point.z }, polygon[0])) {
      dispatch(changeInteractionState(Interaction.Idle));
      return;
    }

    dispatch(addPointToPlane(point.x, point.z));
  };

  const findClickedVertex = () => {
    for (let i = 0; i < points.length; i += 1) {
      if (arePointsClose(cursor, points[i])) {
        setClickedVertex(i);
        return;
      }
    }
  };

  const deleteVertex = () => {
    if (points.length <= 3) {
      console.warn('Room has to have at least 3 corners');
      return;
    }

    findClickedVertex();
    dispatch(deletePoint(clickedVertex));
  };

  const moveVertex = () => {
    if (clickedVertex < 0 || clickedVertex >= points.length) return;
    dispatch(movePoint(clickedVertex, cursor.x, cursor.y));
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (interaction === Interaction.AddingVertex) addVertex(e.intersections[0].point);
    if (interaction === Interaction.DeletingVertex) deleteVertex();
  };

  const onPointerMove = (e: ThreeEvent<MouseEvent>) => {
    const { point } = e.intersections[0];
    setCursor({ x: point.x, y: point.z });
    if (interaction === Interaction.MovingVertex) moveVertex();
  };

  const onPointerUp = (_e: ThreeEvent<MouseEvent>) => {
    if (interaction === Interaction.MovingVertex) {
      dispatch(changeInteractionState(Interaction.Idle));
    }
  };

  const onPointerDown = (_e: ThreeEvent<MouseEvent>) => {
    if (interaction === Interaction.Idle) {
      dispatch(changeInteractionState(Interaction.MovingVertex));
      findClickedVertex();
    }
  };

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
      <RoomCorners points={polygon} preview={cursor} />
      <Ground
        onClick={onClick}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      />
      {interaction === Interaction.AddingVertex
        && <Sphere key="preview" position={cursor} type={SphereType.Preview} />}

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
