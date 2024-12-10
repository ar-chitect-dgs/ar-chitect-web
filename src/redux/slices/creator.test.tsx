import reducer, {
  add,
  changeInteraction,
  Interaction,
  move,
  normalize,
  remove,
} from './creator';

describe('creator reducer', () => {
  const initialState = {
    points: [],
    interaction: Interaction.AddingVertex,
  };

  it('should handle add action', () => {
    const point = { x: 1.234, y: 4.567 };
    const action = add({ x: point.x, y: point.y });
    const state = reducer(initialState, action);

    expect(state.points.length).toBe(1);
    expect(state.points[0]).toEqual({ x: 1.23, y: 4.57 });
  });

  it('should handle move action', () => {
    const initialStateWithPoint = {
      points: [{ x: 1.0, y: 2.0 }],
      interaction: Interaction.AddingVertex,
    };
    const movePayload = { x: 3, y: 4, id: 0 };
    const action = move(movePayload);
    const state = reducer(initialStateWithPoint, action);

    expect(state.points[0]).toEqual({ x: 3.00, y: 4.00 });
  });

  it('should handle remove action', () => {
    const initialStateWithPoint = {
      points: [{ x: 1.0, y: 2.0 }],
      interaction: Interaction.AddingVertex,
    };
    const action = remove({ id: 0 });
    const state = reducer(initialStateWithPoint, action);

    expect(state.points.length).toBe(0);
  });

  it('should handle normalize action', () => {
    const initialStateWithPoints = {
      points: [{ x: 1, y: 1 }, { x: 3, y: 3 }],
      interaction: Interaction.AddingVertex,
    };
    const action = normalize();
    const state = reducer(initialStateWithPoints, action);

    expect(state.points[0]).toEqual({ x: -1.00, y: -1.00 });
    expect(state.points[1]).toEqual({ x: 1.00, y: 1.00 });
  });

  it('should handle changeInteraction action', () => {
    const action = changeInteraction({ interaction: Interaction.MovingVertex });
    const state = reducer(initialState, action);

    expect(state.interaction).toBe(Interaction.MovingVertex);
  });
});
