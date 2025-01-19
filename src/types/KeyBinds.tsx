export enum EditorAction {
  MOVE_UP = 0,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_FRONT,
  MOVE_BACK,
  ROTATE_CW,
  ROTATE_CCW,
  DESELECT,
}

export const editorActionNames: Record<EditorAction, string> = {
  [EditorAction.MOVE_UP]: 'Move model up',
  [EditorAction.MOVE_DOWN]: 'Move model down',
  [EditorAction.MOVE_LEFT]: 'Move model left',
  [EditorAction.MOVE_RIGHT]: 'Move model right',
  [EditorAction.MOVE_FRONT]: 'Move model front',
  [EditorAction.MOVE_BACK]: 'Move model back',
  [EditorAction.ROTATE_CW]: 'Rotate clockwise',
  [EditorAction.ROTATE_CCW]: 'Rotate counterclockwise',
  [EditorAction.DESELECT]: 'Deselect',
};

export type KeyBinds = Record<EditorAction, string>

export const defaultKeyBinds: KeyBinds = {
  [EditorAction.MOVE_UP]: 'Q',
  [EditorAction.MOVE_DOWN]: 'E',
  [EditorAction.MOVE_LEFT]: 'ArrowLeft',
  [EditorAction.MOVE_RIGHT]: 'ArrowRight',
  [EditorAction.MOVE_FRONT]: 'ArrowUp',
  [EditorAction.MOVE_BACK]: 'ArrowDown',
  [EditorAction.ROTATE_CW]: ',',
  [EditorAction.ROTATE_CCW]: '.',
  [EditorAction.DESELECT]: 'Escape',
};
