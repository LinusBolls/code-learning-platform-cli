#!/usr/bin/env node
import { render } from 'ink';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import App from './app.js';

// @ts-expect-error
const runtimeIsBun = typeof Bun !== 'undefined';

render(
  <QueryClientProvider client={new QueryClient()}>
    <App />
  </QueryClientProvider>,
  /**
   * Bun is a javascript runtime (meadning a modern alternative to NodeJs), that has first-class typescript support, among other advantages.
   * however, some NodeJs apis are not yet supported by Bun. one of these is the `console.Console` constructor, which is used by `ink` to patch the console.
   */
  { patchConsole: !runtimeIsBun }
);
