/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useAppDispatch } from '../../redux';
import {
  changeActiveState,
  changeHoveredState,
} from '../../redux/slices/scene';
import { SceneObject } from '../../types/Scene';

export function Model({
  inProjectId,
  url,
  position,
  rotation,
  active,
}: SceneObject): JSX.Element {
  const [gltfModel, setGltfModel] = useState<THREE.Group | null>(null);
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

  const handlePointerDown = () => {
    dispatch(changeActiveState(inProjectId as number));
  };

  if (!gltfModel) return <mesh />;

  return (
    <mesh
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      ref={meshRef}
      onPointerOver={() => dispatch(changeHoveredState(inProjectId as number, true))}
      onPointerOut={() => dispatch(changeHoveredState(inProjectId as number, false))}
    >
      <mesh>
        <primitive object={gltfModel} />
      </mesh>
      <mesh
        position={[0, height / 2, 0]}
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshBasicMaterial color="lightblue" transparent opacity={active ? 0.3 : 0} />
      </mesh>
    </mesh>
  );
}
