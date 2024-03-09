#!/usr/bin/env node
import { render } from 'ink';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import App from './app.js';

render(
  <QueryClientProvider client={new QueryClient()}>
    <App />
  </QueryClientProvider>
);
