import reducer, {
  add,
  changeInteraction,
  clear,
  initialState,
  Interaction,
  move,
  remove,
} from './creator';

describe('creator reducer', () => {
  it('should handle add action', () => {
    const initialState = {
      points: [],
      interaction: Interaction.AddingVertex,
    };
    const action = add({ x: 1.234, y: 4.5677 });
    const nextState = reducer(initialState, action);

    expect(nextState.points.length).toBe(1);
    expect(nextState.points[0]).toEqual({ x: 1.23, y: 4.57 });
  });

  it('should not add point when not in adding state', () => {
    const point = { x: 1.234, y: 4.567 };
    const action = add({ x: point.x, y: point.y });
    const nextState = reducer({ ...initialState, interaction: Interaction.MovingVertex }, action);

    expect(nextState.points.length).toBe(0);
  });

  it('should handle move action', () => {
    const initialState = {
      points: [{ x: 1.0, y: 2.0 }],
      interaction: Interaction.MovingVertex,
    };
    const action = move({ x: 3, y: 4, id: 0 });
    const nextState = reducer(initialState, action);

    expect(nextState.points[0]).toEqual({ x: 3.00, y: 4.00 });
  });

  it('should not move when not in moving state', () => {
    const initialState = {
      points: [{ x: 1.0, y: 2.0 }],
      interaction: Interaction.AddingVertex,
    };
    const action = move({ x: 3, y: 4, id: 0 });
    const nextState = reducer(initialState, action);

    expect(nextState.points.length).toBe(1);
    expect(nextState.points[0]).toEqual({ x: 1.00, y: 2.00 });
  });

  it('should handle remove action', () => {
    const initialState = {
      points: [{ x: 1.0, y: 2.0 }],
      interaction: Interaction.DeletingVertex,
    };
    const action = remove({ id: 0 });
    const nextState = reducer(initialState, action);

    expect(nextState.points.length).toBe(0);
  });

  it('should handle remove action not in removing state', () => {
    const initialState = {
      points: [{ x: 1.0, y: 2.0 }],
      interaction: Interaction.AddingVertex,
    };
    const action = remove({ id: 0 });
    const nextState = reducer(initialState, action);

    expect(nextState.points.length).toBe(1);
    expect(nextState.points[0]).toEqual({ x: 1, y: 2 });
  });

  it('should handle changeInteraction action', () => {
    const action = changeInteraction({ interaction: Interaction.MovingVertex });
    const nextState = reducer(initialState, action);

    expect(nextState.interaction).toBe(Interaction.MovingVertex);
  });

  it('should handle clear action', () => {
    const initialState = {
      points: [{ x: 1.0, y: 2.0 }, { x: 3.0, y: 4.0 }],
      interaction: Interaction.AddingVertex,
    };
    const action = clear();
    const nextState = reducer(initialState, action);

    expect(nextState.points.length).toBe(0);
  });
});
