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
}: SceneObject): JSX.Element {
  const [gltfModel, setGltfModel] = useState<THREE.Group | null>(null);

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

  return gltfModel ? (
    <mesh
      ref={meshRef}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      onClick={() => dispatch(changeActiveState(inProjectId as number))}
      onPointerOver={() => dispatch(changeHoveredState(inProjectId as number, true))}
      onPointerOut={() => dispatch(changeHoveredState(inProjectId as number, false))}
    >
      <primitive object={gltfModel} />
    </mesh>
  ) : (
    <mesh />
  );
}
