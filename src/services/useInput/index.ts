import { useInput as useInputInk } from 'ink';

import { ExecutionContext } from '../cli/index.js';
import { useInputBunFill } from './useInputBunFill.js';

const useInput: typeof useInputInk = ExecutionContext.runtime.isBun
  ? useInputBunFill
  : useInputInk;

export default useInput;
