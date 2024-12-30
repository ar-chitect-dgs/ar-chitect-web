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
        },
        selectedObjectId: null,
      },
    };
  });

  it('should handle hover action', () => {
    const id = 0;
    const hovered = true;

    const nextState = sceneReducer(state, hover({ id, hovered }));
    expect(nextState.scene.objects[id].hovered).toBe(true);
  });

  it('should handle click action', () => {
    const id = 0;

    const nextState = sceneReducer(state, click(id));
    expect(nextState.scene.selectedObjectId).toBe(id);
    expect(nextState.scene.objects[id].active).toBe(true);
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
