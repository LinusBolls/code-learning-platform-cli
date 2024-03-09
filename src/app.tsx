import { Box, useInput } from 'ink';
import React, { useState } from 'react';

import { useLearningPlatform } from './services/useLearningPlatform/index.js';
import { useNavigation } from './services/useNavigation/index.js';
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

  const navigation = useNavigation();

  const loginPageProps = useLoginPage();
  const modulesListProps = useModulesList(true);
  const moduleInfoProps = useModuleInfo(true);
  const sideNavProps = useSideNav(true, [
    [
      {
        title: 'Dashboard',
        hotkeys: ['1'],
      },
      {
        title: 'Modules',
        hotkeys: ['2'],
      },
      {
        title: 'Hand-ins',
        hotkeys: ['3'],
      },
      {
        title: 'Events',
        hotkeys: ['4'],
      },
      {
        title: 'Academic Events',
        hotkeys: ['5'],
      },
      {
        title: 'Projects',
        hotkeys: ['6'],
      },
      {
        title: 'Users',
        hotkeys: ['7'],
      },
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

    if (['q', 'Q'].includes(input)) {
      // flush the screen before quitting the application
      process.stdout.write('\x1b[2J\x1b[0;0H');
      process.exit(0);
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
    <Box gap={1}>
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
