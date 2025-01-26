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
  const [clickedVertexId, setClickedVertexId] = useState(-1);

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
        setClickedVertexId(i);
        return;
      }
    }
  };

  const deleteVertex = () => {
    if (points.length <= 3) {
      console.warn('Room has to have at least 3 corners');
      return;
    }

    dispatch(deletePoint(clickedVertexId));
  };

  const moveVertex = () => {
    if (clickedVertexId < 0 || clickedVertexId >= points.length) return;
    dispatch(movePoint(clickedVertexId, cursor.x, cursor.y));
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
    findClickedVertex();
    if (interaction === Interaction.Idle) {
      dispatch(changeInteractionState(Interaction.MovingVertex));
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

      <ambientLight intensity={2} />
      <pointLight position={[0, 2, 0]} rotation={[0, 0, 0]} decay={0} intensity={3} />

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
