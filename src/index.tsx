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
