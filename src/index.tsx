#!/usr/bin/env node
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { render } from 'ink';
import React from 'react';

import App from './app.js';
import {
  clearTerminalOnStartup,
  ExecutionContext,
} from './services/cli/index.js';
import { writeJsonCacheSync } from './services/useFileSystem/index.js';

clearTerminalOnStartup();

render(
  <QueryClientProvider
    client={
      new QueryClient({
        queryCache: new QueryCache({
          onSuccess: (data, query) => {
            writeJsonCacheSync(query.queryKey.join('-') + '.cache.json', data);
          },
        }),
      })
    }
  >
    <App />
  </QueryClientProvider>,
  { patchConsole: ExecutionContext.runtime.isNode }
);

/**
 * when we migrated the state in `useModulesList` to zustand, we started getting an error message from react
 * when on the last tab of the modules list and specifying a search query so that the curren page would no longer exist.
 * it works, though
 */
console.error = () => {};
console.warn = () => {};
