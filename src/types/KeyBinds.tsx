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
  DELETE,
  COPY,
  NO_SNAP,
}

export const editorActionNames: Record<EditorAction, string> = {
  [EditorAction.MOVE_UP]: 'settings.moveUp',
  [EditorAction.MOVE_DOWN]: 'settings.moveDown',
  [EditorAction.MOVE_LEFT]: 'settings.moveLeft',
  [EditorAction.MOVE_RIGHT]: 'settings.moveRight',
  [EditorAction.MOVE_FRONT]: 'settings.moveFront',
  [EditorAction.MOVE_BACK]: 'settings.moveBack',
  [EditorAction.ROTATE_CW]: 'settings.rotateCw',
  [EditorAction.ROTATE_CCW]: 'settings.rotateCcw',
  [EditorAction.DESELECT]: 'settings.deselect',
  [EditorAction.DELETE]: 'settings.delete',
  [EditorAction.COPY]: 'settings.copy',
  [EditorAction.NO_SNAP]: 'settings.noSnap',
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
  [EditorAction.DELETE]: 'Delete',
  [EditorAction.COPY]: 'C',
  [EditorAction.NO_SNAP]: 'Control',
};
