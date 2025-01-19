export enum EditorAction {
  MOVE_UP = 'Move model up',
  MOVE_DOWN = 'Move model down',
  MOVE_LEFT = 'Move model left',
  MOVE_RIGHT = 'Move model right',
  MOVE_FRONT = 'Move model front',
  MOVE_BACK = 'Move model back',
  DESELECT = 'Deselect',
}

export type KeyBinds = Record<EditorAction, string>

export const defaultKeyBinds: KeyBinds = {
  [EditorAction.MOVE_UP]: 'Q',
  [EditorAction.MOVE_DOWN]: 'E',
  [EditorAction.MOVE_LEFT]: 'ArrowLeft',
  [EditorAction.MOVE_RIGHT]: 'ArrowRight',
  [EditorAction.MOVE_FRONT]: 'ArrowUp',
  [EditorAction.MOVE_BACK]: 'ArrowDown',
  [EditorAction.DESELECT]: 'Escape',
};
