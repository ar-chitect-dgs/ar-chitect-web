/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useAppDispatch } from '../../redux';
import {
  sceneSelector,
} from '../../redux/slices/scene';
import { SceneObject } from '../../types/Scene';

// todo unify this
export const MODEL_TYPE = 'model';

export function Model({
  inProjectId,
  url,
  position,
  rotation,
}: SceneObject): JSX.Element {
  const [gltfModel, setGltfModel] = useState<THREE.Group | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [depth, setDepth] = useState(0);

  const meshRef = useRef<THREE.Mesh>(null);
  const dispatch = useAppDispatch();

  // todo these should be probably passed from the parent component
  const { scene } = useSelector(sceneSelector);
  const hovered = inProjectId === scene.hoveredObjectId;
  const active = inProjectId === scene.activeObjectId;

  useEffect(() => {
    const loader = new GLTFLoader();

    loader.load(
      'chair_2_creme.glb',
      // url, todo
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

    const boundingBox = new THREE.Box3().setFromObject(meshRef.current as THREE.Object3D);

    setWidth(boundingBox.max.x - boundingBox.min.x);
    setHeight(boundingBox.max.y - boundingBox.min.y);
    setDepth(boundingBox.max.z - boundingBox.min.z);
  }, [meshRef.current]);

  let opacity = 0;
  if (active) {
    opacity = 0.4;
  } else if (hovered) {
    opacity = 0.2;
  }

  if (!gltfModel) return <mesh />;

  return (
    <mesh
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      ref={meshRef}
    >
      <mesh>
        <primitive object={gltfModel} />
      </mesh>
      <mesh
        position={[0, height / 2, 0]}
        userData={{ name: MODEL_TYPE, id: inProjectId }}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshBasicMaterial color="lightblue" transparent opacity={opacity} />
      </mesh>
    </mesh>
  );
}
