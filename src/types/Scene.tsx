import { Vector3 } from "@react-three/fiber";

export interface Object {
  id: number;
  name: string;
  position: Vector3;
}

export interface Scene {
  objects: Array<Object>;
}