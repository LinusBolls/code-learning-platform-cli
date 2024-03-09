import { useInput as useInputInk } from 'ink';

import { useInputBunFill } from './useInputBunFill.js';

// @ts-expect-error
const runtimeIsBun = typeof Bun !== 'undefined';

const useInput: typeof useInputInk = runtimeIsBun
  ? useInputBunFill
  : useInputInk;

export default useInput;
