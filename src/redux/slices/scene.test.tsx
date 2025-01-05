import sceneReducer, {
  add,
  Axis,
  click,
  hover,
  move,
  remove,
  rotate,
  SceneState,
} from './scene';

describe('scene reducer', () => {
  let state: SceneState;

  beforeEach(() => {
    state = {
      scene: {
        corners: [],
        objectIds: [0, 1],
        objects: {
          0: {
            inProjectId: 0,
            objectId: 'sofa_1',
            name: 'Sofa 1',
            color: 'default',
            url: 'sofa_url_1',
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            active: false,
            hovered: false,
          },
          1: {
            inProjectId: 1,
            objectId: 'sofa_2',
            name: 'Sofa 2',
            color: 'creme',
            url: 'sofa_url_2',
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: Math.PI, z: 0 },
            active: false,
            hovered: false,
          },
          2: {
            inProjectId: 2,
            objectId: 'chair_1',
            name: 'Chair 1',
            color: 'blue',
            url: 'chair_url_1',
            position: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 },
            active: false,
            hovered: false,
          },
          3: {
            inProjectId: 3,
            objectId: 'table_1',
            name: 'Table 1',
            color: 'brown',
            url: 'table_url_1',
            position: { x: 2, y: 2, z: 2 },
            rotation: { x: 0, y: 0, z: 0 },
            active: false,
            hovered: false,
          },
          4: {
            inProjectId: 4,
            objectId: 'lamp_1',
            name: 'Lamp 1',
            color: 'white',
            url: 'lamp_url_1',
            position: { x: 3, y: 3, z: 3 },
            rotation: { x: 0, y: 0, z: 0 },
            active: false,
            hovered: false,
          },
        },
        selectedObjectId: null,
      },
    };
  });

  it('should handle hover action', () => {
    const id = 2;
    const hovered = true;

    const nextState = sceneReducer(state, hover({ id, hovered }));
    nextState.scene.objectIds.forEach((objectId) => {
      expect(nextState.scene.objects[objectId].hovered).toBe(objectId === id);
    });
  });

  it('should handle unhover action', () => {
    const id = 2;
    const hovered = false;

    const nextState = sceneReducer(state, hover({ id, hovered }));
    nextState.scene.objectIds.forEach((objectId) => {
      expect(nextState.scene.objects[objectId].hovered).toBe(false);
    });
  });

  it('should handle click action', () => {
    const id = 1;

    const nextState = sceneReducer(state, click(id));
    expect(nextState.scene.selectedObjectId).toBe(id);

    nextState.scene.objectIds.forEach((objectId) => {
      expect(nextState.scene.objects[objectId].active).toBe(objectId === id);
    });
  });

  it('should have only one active model', () => {
    const tmpId = 1;
    const id = 3;

    const tempState = sceneReducer(state, click(tmpId));
    const nextState = sceneReducer(tempState, click(id));
    expect(nextState.scene.selectedObjectId).toBe(id);

    nextState.scene.objectIds.forEach((objectId) => {
      expect(nextState.scene.objects[objectId].active).toBe(objectId === id);
    });
  });

  it('should handle move action X', () => {
    const id = 0;
    const value = 10;
    const axis = Axis.X;

    const nextState = sceneReducer(state, move({ id, value, axis }));
    expect(nextState.scene.objects[id].position.x).toBe(value);
  });

  it('should handle move action Y', () => {
    const id = 0;
    const value = 10;
    const axis = Axis.Y;

    const nextState = sceneReducer(state, move({ id, value, axis }));
    expect(nextState.scene.objects[id].position.y).toBe(value);
  });

  it('should handle move action Z', () => {
    const id = 0;
    const value = 10;
    const axis = Axis.Z;

    const nextState = sceneReducer(state, move({ id, value, axis }));
    expect(nextState.scene.objects[id].position.z).toBe(value);
  });

  it('should handle rotate action X', () => {
    const id = 1;
    const value = Math.PI / 2;
    const axis = Axis.X;

    const nextState = sceneReducer(state, rotate({ id, value, axis }));
    expect(nextState.scene.objects[id].rotation.x).toBe(value);
  });

  it('should handle rotate action Y', () => {
    const id = 1;
    const value = Math.PI / 2;
    const axis = Axis.Y;

    const nextState = sceneReducer(state, rotate({ id, value, axis }));
    expect(nextState.scene.objects[id].rotation.y).toBe(value);
  });

  it('should handle rotate action Z', () => {
    const id = 1;
    const value = Math.PI / 2;
    const axis = Axis.Z;

    const nextState = sceneReducer(state, rotate({ id, value, axis }));
    expect(nextState.scene.objects[id].rotation.z).toBe(value);
  });

  it('should handle add action', () => {
    const payload = {
      objectId: 'table_1',
      name: 'Table 1',
      color: 'brown',
      url: 'https://example.com/table.glb',
    };

    const nextState = sceneReducer(state, add(payload));
    const newId = Math.max(...nextState.scene.objectIds);

    expect(nextState.scene.objects[newId]).toMatchObject({
      ...payload,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      active: true,
      hovered: false,
    });
    expect(nextState.scene.selectedObjectId).toBe(newId);
  });

  it('should handle remove action', () => {
    const id = 1;

    const nextState = sceneReducer(state, remove({ id }));
    expect(nextState.scene.objects[id]).toBeUndefined();
    expect(nextState.scene.objectIds).not.toContain(id);
  });
});
