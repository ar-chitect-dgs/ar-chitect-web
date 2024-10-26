import { Vector3 } from "@react-three/fiber";

export interface Object {
  id: number;
  name: string;
  position: Vector3;
  active: boolean;
  hovered: boolean;
}

export interface Scene {
  objects: Array<Object>;
}