import sceneReducer, {
  activate,
  add,
  Axis,
  hover, move, remove,
  rotate,
  EditorState,
  Interaction,
} from './editor';

describe('scene reducer', () => {
  let state: EditorState;

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

          },
          1: {
            inProjectId: 1,
            objectId: 'sofa_2',
            name: 'Sofa 2',
            color: 'creme',
            url: 'sofa_url_2',
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: Math.PI, z: 0 },

          },
        },
        activeObjectId: null,
        hoveredObjectId: null,
        wallColor: 'gray',
        floorColor: '#8E7358',
      },
      interaction: Interaction.Idle,
      snapToWalls: true,
    };
  });

  it('should handle hover action', () => {
    const id = 0;

    const nextState = sceneReducer(state, hover(id));
    expect(nextState.scene.hoveredObjectId).toBe(id);
  });

  it('should handle hover action with null input', () => {
    const nextState = sceneReducer(state, hover(null));
    expect(nextState.scene.hoveredObjectId).toBe(null);
  });

  it('should handle activate action', () => {
    const id = 0;

    const nextState = sceneReducer(state, activate(id));
    expect(nextState.scene.activeObjectId).toBe(id);
  });

  it('should handle activate action with null input', () => {
    const nextState = sceneReducer(state, hover(null));
    expect(nextState.scene.hoveredObjectId).toBe(null);
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
    expect(nextState.scene.objects[id].rotation.x).toBe(1.57);
  });

  it('should handle rotate action Y', () => {
    const id = 1;
    const value = Math.PI / 2;
    const axis = Axis.Y;

    const nextState = sceneReducer(state, rotate({ id, value, axis }));
    expect(nextState.scene.objects[id].rotation.y).toBe(1.57);
  });

  it('should handle rotate action Z', () => {
    const id = 1;
    const value = Math.PI / 2;
    const axis = Axis.Z;

    const nextState = sceneReducer(state, rotate({ id, value, axis }));
    expect(nextState.scene.objects[id].rotation.z).toBe(1.57);
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
    expect(nextState.scene.activeObjectId).toBe(newId);
  });

  it('should handle remove action', () => {
    const id = 1;

    const nextState = sceneReducer(state, remove({ id }));
    expect(nextState.scene.objects[id]).toBeUndefined();
    expect(nextState.scene.objectIds).not.toContain(id);
  });
});
