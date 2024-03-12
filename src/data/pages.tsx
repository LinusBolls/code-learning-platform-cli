import { Box, Text } from 'ink';
import React from 'react';

import { useTheme } from '../services/useTheme/index.js';
import Breadcrumbs from '../ui/component/Breadcrumbs.js';
import Dashboard from '../ui/feature/Dashboard/index.js';
import useDashboard from '../ui/feature/Dashboard/useDashboard.js';
import EventsList from '../ui/feature/EventsList/index.js';
import useEventsList from '../ui/feature/EventsList/useEventsList.js';
import ModuleInfo from '../ui/feature/ModuleInfo/index.js';
import useModuleInfo from '../ui/feature/ModuleInfo/useModuleInfo.js';
import ModulesList from '../ui/feature/ModulesList/index.js';
import useModulesList from '../ui/feature/ModulesList/useModulesList.js';
import Settings from '../ui/feature/Settings/index.js';
import useSettings from '../ui/feature/Settings/useSettings.js';

function Placeholder({ title }: { title: string }) {
  const { theme } = useTheme();
  return (
    <Box flexDirection="column" flexGrow={1}>
      <Breadcrumbs steps={[title]} />
      <Box alignItems="center" justifyContent="center" flexGrow={1}>
        <Text color={theme.text.secondary}>Coming soon</Text>
      </Box>
    </Box>
  );
}

export const pages = {
  dashboard: {
    component: () => <Dashboard {...useDashboard()} />,
    path: 'dashboard',
    title: 'Dashboard',
    hotkeys: ['1'],
  },
  modules: {
    component: () => <ModulesList {...useModulesList()} />,
    path: 'modules',
    title: 'Modules',
    hotkeys: ['2'],
  },
  module: {
    component: () => <ModuleInfo {...useModuleInfo()} />,
    path: 'module',
  },
  handIns: {
    component: () => <Placeholder title="Hand-ins" />,
    path: 'handIns',
    title: 'Hand-ins',
    hotkeys: ['3'],
  },
  events: {
    component: () => <EventsList {...useEventsList()} />,
    path: 'events',
    title: 'Events',
    hotkeys: ['4'],
  },
  academicEvents: {
    component: () => <Placeholder title="Academic Events" />,
    path: 'academicEvents',
    title: 'Academic Events',
    hotkeys: ['5'],
  },
  projects: {
    component: () => <Placeholder title="Projects" />,
    path: 'projects',
    title: 'Projects',
    hotkeys: ['6'],
  },
  users: {
    component: () => <Placeholder title="Users" />,
    path: 'users',
    title: 'Users',
    hotkeys: ['7'],
  },
  settings: {
    component: () => <Settings {...useSettings()} />,
    path: 'settings',
    title: 'Settings',
    hotkeys: ['8'],
  },
};
