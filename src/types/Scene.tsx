// position isn't a Vector3 to make Object serializable. 
// see https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state for reference
export interface SceneObject {
  id: number;
  name: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  active: boolean;
  hovered: boolean;
}

export interface Scene {
  objectIds: Array<number>;
  objects: Map<number, SceneObject>;
}