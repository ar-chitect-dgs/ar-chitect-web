/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MODEL } from '.';
import { SceneObject } from '../../types/Scene';

type ModelProps = SceneObject & {
  hovered: boolean,
  active: boolean,
  passDepthToParent?: (_: number) => void
}

export function Model({
  inProjectId,
  url,
  position,
  rotation,
  hovered,
  active,
  passDepthToParent,
}: ModelProps): JSX.Element {
  const [gltfModel, setGltfModel] = useState<THREE.Group | null>(null);
  // Axis aligned copy of the model to compute bounding box
  const [aaGltfModel, setAaGltfModel] = useState<THREE.Group | null>(null);
  const [depth, setDepth] = useState(0);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene.clone(true);
        setGltfModel(model);
        setAaGltfModel(model.clone(true));

        const boundingBox = new THREE.Box3().setFromObject(model as THREE.Object3D);

        setDepth(boundingBox.max.x - boundingBox.min.x);
        setHeight(boundingBox.max.y - boundingBox.min.y);
        setWidth(boundingBox.max.z - boundingBox.min.z);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the model:', error);
      },
    );
  }, [url]);

  useEffect(() => {
    if (passDepthToParent !== undefined) {
      passDepthToParent(depth);
    }
  }, [depth, passDepthToParent]);

  let opacity = 0;
  if (active) {
    opacity = 0.4;
  } else if (hovered) {
    opacity = 0.2;
  }

  if (!gltfModel || !aaGltfModel) return <mesh />;

  return (
    <group>
      <mesh
        position={[position.x, position.y, position.z]}
        rotation={[rotation.x, rotation.y, rotation.z]}
      >
        <mesh>
          <primitive object={gltfModel} />
        </mesh>
        <mesh
          position={[0, height / 2, 0]}
          userData={{ name: MODEL, id: inProjectId }}
          castShadow={false}
        >
          <boxGeometry args={[depth, height, width]} />
          <meshStandardMaterial
            color="lightblue"
            transparent
            opacity={opacity}
            visible={hovered || active}
          />
        </mesh>
      </mesh>
      <mesh position={[position.x, position.y, position.z]} ref={meshRef} visible={false}>
        <primitive object={aaGltfModel} />
      </mesh>
    </group>
  );
}
