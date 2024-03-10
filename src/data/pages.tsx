import { Box, Text } from 'ink';
import React from 'react';

import { useTheme } from '../services/useTheme/index.js';
import Breadcrumbs from '../ui/component/Breadcrumbs.js';
import Dashboard from '../ui/feature/Dashboard/index.js';
import ModuleInfo from '../ui/feature/ModuleInfo/index.js';
import useModuleInfo from '../ui/feature/ModuleInfo/useModuleInfo.js';
import ModulesList from '../ui/feature/ModulesList/index.js';
import useModulesList from '../ui/feature/ModulesList/useModulesList.js';

function Placeholder({ title }: { title: string }) {
  const { theme } = useTheme();
  return (
    <Box flexDirection="column" flexGrow={1}>
      <Breadcrumbs steps={[title]} />
      <Box alignItems="center" justifyContent="center" flexGrow={1}>
        <Text color={theme.text.secondary}>Coming soon ;)</Text>
      </Box>
    </Box>
  );
}

export const pages = {
  dashboard: {
    render: () => <Dashboard />,
    id: 'dashboard',
    title: 'Dashboard',
    hotkeys: ['1'],
  },
  modules: {
    render: () => <ModulesList {...useModulesList()} />,
    id: 'modules',
    title: 'Modules',
    hotkeys: ['2'],
  },
  module: {
    render: () => <ModuleInfo {...useModuleInfo()} />,
    id: 'module',
  },
  handIns: {
    render: () => <Placeholder title="Hand-ins" />,
    id: 'handIns',
    title: 'Hand-ins',
    hotkeys: ['3'],
  },
  events: {
    render: () => <Placeholder title="Events" />,
    id: 'events',
    title: 'Events',
    hotkeys: ['4'],
  },
  academicEvents: {
    render: () => <Placeholder title="Academic Events" />,
    id: 'academicEvents',
    title: 'Academic Events',
    hotkeys: ['5'],
  },
  projects: {
    render: () => <Placeholder title="Projects" />,
    id: 'projects',
    title: 'Projects',
    hotkeys: ['6'],
  },
  users: {
    render: () => <Placeholder title="Users" />,
    id: 'users',
    title: 'Users',
    hotkeys: ['7'],
  },
};
