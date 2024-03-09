import { useCallback } from 'react';
import readline from 'readline';

interface Key {
  /**
   * Up arrow key was pressed.
   */
  upArrow: boolean;
  /**
   * Down arrow key was pressed.
   */
  downArrow: boolean;
  /**
   * Left arrow key was pressed.
   */
  leftArrow: boolean;
  /**
   * Right arrow key was pressed.
   */
  rightArrow: boolean;
  /**
   * Page Down key was pressed.
   */
  pageDown: boolean;
  /**
   * Page Up key was pressed.
   */
  pageUp: boolean;
  /**
   * Return (Enter) key was pressed.
   */
  return: boolean;
  /**
   * Escape key was pressed.
   */
  escape: boolean;
  /**
   * Ctrl key was pressed.
   */
  ctrl: boolean;
  /**
   * Shift key was pressed.
   */
  shift: boolean;
  /**
   * Tab key was pressed.
   */
  tab: boolean;
  /**
   * Backspace key was pressed.
   */
  backspace: boolean;
  /**
   * Delete key was pressed.
   */
  delete: boolean;
  /**
   * [Meta key](https://en.wikipedia.org/wiki/Meta_key) was pressed.
   */
  meta: boolean;
}

export function useInputBunFill(
  inputHandler: (input: string, key: Key) => void,
  options?: { isActive?: boolean }
) {
  // Set the stdin in raw mode to get the keypresses as they come, without needing to press enter
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  readline.emitKeypressEvents(process.stdin);

  const func = useCallback(
    (
      str: string,
      key: {
        sequence: string;
        name: string;
        ctrl: boolean;
        shift: boolean;
        meta: boolean;
      }
    ) => {
      if (options?.isActive === false) return;

      inputHandler(str, {
        upArrow: key.name === 'up',
        downArrow: key.name === 'down',
        leftArrow: key.name === 'left',
        rightArrow: key.name === 'right',
        pageDown: key.name === 'pagedown',
        pageUp: key.name === 'pageup',
        return: key.name === 'return',
        escape: key.name === 'escape',
        ctrl: key.ctrl,
        shift: key.shift,
        tab: key.name === 'tab',
        backspace: key.name === 'backspace',
        delete: key.name === 'delete',
        meta: key.meta,
      });
    },
    []
  );
  process.stdin.on('keypress', func);
}
