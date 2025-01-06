/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux';
import { SceneObject } from '../../types/Scene';
import { sceneSelector } from '../../redux/slices/scene';

// todo unify this
export const MODEL_BOUNDING_BOX = 'model';

type ModelProps = SceneObject & {
  hovered: boolean,
  active: boolean,
}

export function Model({
  inProjectId,
  url,
  position,
  rotation,
  hovered,
  active,
}: ModelProps): JSX.Element {
  const [gltfModel, setGltfModel] = useState<THREE.Group | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [depth, setDepth] = useState(0);

  const meshRef = useRef<THREE.Mesh>(null);
  const dispatch = useAppDispatch();

  const { scene } = useSelector(sceneSelector);
  let h = false;
  if (scene.hoveredObjectId != null) {
    h = scene.hoveredObjectId === inProjectId;
  }

  // todo these should be probably passed from the parent component

  useEffect(() => {
    const loader = new GLTFLoader();

    loader.load(
      // 'chair_2_creme.glb',
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

    const boundingBox = new THREE.Box3().setFromObject(meshRef.current as THREE.Object3D);

    setWidth(boundingBox.max.x - boundingBox.min.x + 0.1);
    setHeight(boundingBox.max.y - boundingBox.min.y + 0.1);
    setDepth(boundingBox.max.z - boundingBox.min.z + 0.1);
  }, [meshRef.current]);

  let opacity = 0;
  if (active) {
    opacity = 0.4;
  } else if (h) {
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
        userData={{ name: MODEL_BOUNDING_BOX, id: inProjectId }}
        castShadow={false}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshBasicMaterial color="lightblue" transparent opacity={opacity} />
      </mesh>
    </mesh>
  );
}
