import { Box, useInput } from 'ink';
import React, { useState } from 'react';

import { useLearningPlatform } from './services/useLearningPlatform/index.js';
import LoadingSpinner from './ui/component/LoadingSpinner.js';
import Login from './ui/feature/Login/index.js';
import useLoginPage from './ui/feature/Login/useLoginPage.js';
import ModuleInfo from './ui/feature/ModuleInfo/index.js';
import useModuleInfo from './ui/feature/ModuleInfo/useModuleInfo.js';
import ModulesList from './ui/feature/ModulesList/index.js';
import useModulesList from './ui/feature/ModulesList/useModulesList.js';
import SideNav from './ui/feature/SideNav/index.js';
import useSideNav from './ui/feature/SideNav/useSideNav.js';

const App = () => {
  const { isAuthenticated, isLoadingSession } = useLearningPlatform();

  const [activePanel, setActivePanel] = useState(0);

  const loginPageProps = useLoginPage();
  const modulesListProps = useModulesList(activePanel === 1);
  const moduleInfoProps = useModuleInfo(activePanel === 2);
  const sideNavProps = useSideNav(activePanel === 0, [
    {
      title: 'Dashboard',
    },
    {
      title: 'Modules',
    },
    {
      title: 'Hand-ins',
    },
    {
      title: 'Events',
    },
    {
      title: 'Academic Events',
    },
    {
      title: 'Projects',
    },
    {
      title: 'Users',
    },
  ]);

  useInput((input, key) => {
    if (input === 'q') {
      process.exit();
    }
    if (key.tab) {
      if (key.shift) {
        if (activePanel === 1) {
          setActivePanel(0);
        }
        if (activePanel === 2) {
          setActivePanel(1);
        }
      } else {
        if (activePanel === 0) {
          setActivePanel(1);
        }
        if (activePanel === 1) {
          setActivePanel(2);
        }
      }
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

  return (
    <Box gap={2}>
      <SideNav {...sideNavProps} />
      {sideNavProps.activeItemIdx === 1 &&
        (activePanel < 2 ? (
          <ModulesList {...modulesListProps} />
        ) : (
          <ModuleInfo {...moduleInfoProps} />
        ))}
    </Box>
  );
};
export default App;
