/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D } from '../../types/Project';

function Model({ url, position, rotation }: Object3D): JSX.Element {
  const [gltfModel, setGltfModel] = useState<THREE.Group | null>(null);

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
      position={new THREE.Vector3(...position)}
      rotation={new THREE.Euler(...rotation)}
    >
      <primitive object={gltfModel} scale={1.5} />
    </mesh>
  ) : (
    <mesh />
  );
}

export default Model;
