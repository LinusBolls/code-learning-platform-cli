import { Box } from 'ink';
import React from 'react';

import { pages } from './data/pages.js';
import { quitApplication } from './services/cli/index.js';
import useInput from './services/useInput/index.js';
import { useLearningPlatform } from './services/useLearningPlatform/index.js';
import { useNavigation } from './services/useNavigation/index.js';
import LoadingSpinner from './ui/component/LoadingSpinner.js';
import Login from './ui/feature/Login/index.js';
import useLoginPage from './ui/feature/Login/useLoginPage.js';
import SideNav from './ui/feature/SideNav/index.js';
import useSideNav from './ui/feature/SideNav/useSideNav.js';

const App = () => {
  const { isAuthenticated, isLoadingSession } = useLearningPlatform();

  const navigation = useNavigation();

  const loginPageProps = useLoginPage();
  const sideNavProps = useSideNav(true, [
    [
      pages.dashboard,
      pages.modules,
      pages.handIns,
      pages.events,
      pages.academicEvents,
      pages.projects,
      pages.users,
    ],
    [
      {
        title: 'Exit',
        hotkeys: ['Q', 'q'],
      },
    ],
  ]);

  useInput((input, key) => {
    if (key.escape) {
      navigation.unfocus();
    }
    if (!navigation.canReceiveHotkeys) return;

    if (input.toLowerCase() === 'q') {
      quitApplication();
    }
  });

  if (isLoadingSession) {
    return (
      <Box alignItems="center" justifyContent="center" width="42" height="12">
        <LoadingSpinner />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Login {...loginPageProps} />;
  }
  const pageData = pages[navigation.path as keyof typeof pages];

  const Page = pageData.component;

  return (
    <Box columnGap={1}>
      <Box flexDirection="column">
        <SideNav {...sideNavProps} />
      </Box>
      {<Page />}
    </Box>
  );
};
export default App;
