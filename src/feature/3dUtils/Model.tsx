/* eslint-disable react/no-unknown-property */
import { ThreeEvent } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useAppDispatch } from '../../redux';
import {
  changeActiveState,
  changeHoveredState,
  moveObjectTo,
} from '../../redux/slices/scene';
import { SceneObject } from '../../types/Scene';
import { RAYCASTER_GROUND } from './Ground';

export function Model({
  inProjectId,
  url,
  position,
  rotation,
  active,
}: SceneObject): JSX.Element {
  const [gltfModel, setGltfModel] = useState<THREE.Group | null>(null);
  const [moving, setMoving] = useState(true);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [depth, setDepth] = useState(0);

  const meshRef = useRef<THREE.Mesh>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        const clonedScene = gltf.scene.clone(true);
        setGltfModel(clonedScene);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the model:', error);
      },
    );
  }, [url]);

  useEffect(() => {
    if (!meshRef.current) return;

    meshRef.current.geometry.computeBoundingBox();

    const boundingBox = new THREE.Box3().setFromObject(meshRef.current as THREE.Object3D);
    console.log('bounding box:', boundingBox);

    setWidth(boundingBox.max.x - boundingBox.min.x);
    setHeight(boundingBox.max.y - boundingBox.min.y);
    setDepth(boundingBox.max.z - boundingBox.min.z);
  }, [meshRef.current]);

  // todo move these to viewport
  // see this along with comment https://stackoverflow.com/questions/75466281/three-js-drag-a-model-on-x-and-z-axis-react-three-fiber
  const handlePointerMove = (e: ThreeEvent<MouseEvent>) => {
    if (!active || !moving) return;

    e.intersections.forEach((intersection) => {
      if (intersection.object.userData
        && intersection.object.userData.name === RAYCASTER_GROUND) {
        const { point } = intersection;
        dispatch(moveObjectTo(
          inProjectId as number,
          point.x,
          point.z,
        ));
      }
    });
  };

  const handlePointerDown = () => {
    // console.log('down');
    // setMoving(!moving);
  };

  const handlePointerUp = () => {
    // console.log('up');
    // setMoving(false);
  };

  return gltfModel ? (
    <mesh
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      ref={meshRef}
      onClick={() => { dispatch(changeActiveState(inProjectId as number)); }}
      onPointerOver={() => dispatch(changeHoveredState(inProjectId as number, true))}
      onPointerOut={() => dispatch(changeHoveredState(inProjectId as number, false))}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <mesh>
        <primitive object={gltfModel} />
      </mesh>
      <mesh
        position={[0, height / 2, 0]}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshBasicMaterial color="red" transparent opacity={0.5} />
      </mesh>
    </mesh>
  ) : (
    <mesh />
  );
}
