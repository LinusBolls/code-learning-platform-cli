import { Box, Text } from 'ink';
import React from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import Breadcrumbs from '../../component/Breadcrumbs.js';
import Progress from '../../component/Progress.js';
import TitledBox from '../../component/TitledBox.js';

export interface DashboardProps {}
export default function Dashboard() {
  const { theme } = useTheme();

  const boxMinHeight = 5;

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Breadcrumbs steps={['Dashboard']} />
      <Box gap={1} paddingTop={1}>
        <Box flexDirection="column" gap={1} flexGrow={1}>
          <TitledBox
            title="My Semester"
            borderColor={theme.card.border.default}
            titleProps={{ color: theme.card.heading.default }}
            flexDirection="column"
            borderStyle="single"
            minHeight={4}
          >
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <Text color={theme.text.secondary}>No Data</Text>
            </Box>
          </TitledBox>
          <TitledBox
            title="Study Progress (49/180 ECTS)"
            borderColor={theme.card.border.default}
            titleProps={{ color: theme.card.heading.default }}
            flexDirection="column"
            borderStyle="single"
            paddingX={2}
            paddingY={1}
            minHeight={boxMinHeight}
            gap={1}
          >
            <Box flexDirection="column">
              <Text>
                Orientation Semester{' '}
                <Text color={theme.text.secondary}>(24/24 ECTS)</Text>
              </Text>
              <Progress
                progressFloat={24 / 24}
                progressColor="#a0d911"
                trackColor={theme.text.secondary}
              />
            </Box>
            <Box flexDirection="column">
              <Text>
                Mandatory Modules{' '}
                <Text color={theme.text.secondary}>(5/40 ECTS)</Text>
              </Text>
              <Progress
                progressFloat={5 / 40}
                progressColor="#1890ff"
                trackColor={theme.text.secondary}
              />
            </Box>
            <Box flexDirection="column">
              <Text>
                Compulsory Elective Modules{' '}
                <Text color={theme.text.secondary}>(0/10 ECTS)</Text>
              </Text>
              <Progress
                progressFloat={0 / 10}
                progressColor="#1890ff"
                trackColor={theme.text.secondary}
              />
            </Box>
            <Box flexDirection="column">
              <Text>
                Elective Modules{' '}
                <Text color={theme.text.secondary}>(20/50 ECTS)</Text>
              </Text>
              <Progress
                progressFloat={20 / 50}
                progressColor="#1890ff"
                trackColor={theme.text.secondary}
              />
            </Box>
            <Box flexDirection="column">
              <Text>
                Mandatory STS Modules{' '}
                <Text color={theme.text.secondary}>(0/26 ECTS)</Text>
              </Text>
              <Progress
                progressFloat={0 / 26}
                progressColor="#ffa940"
                trackColor={theme.text.secondary}
              />
            </Box>
            <Box flexDirection="column">
              <Text>
                Thesis <Text color={theme.text.secondary}>(0/15 ECTS)</Text>
              </Text>
              <Progress
                progressFloat={0 / 15}
                progressColor="#ffa940"
                trackColor={theme.text.secondary}
              />
            </Box>
            <Box flexDirection="column">
              <Text>
                Capstone Project{' '}
                <Text color={theme.text.secondary}>(0/15 ECTS)</Text>
              </Text>
              <Progress
                progressFloat={0 / 15}
                progressColor="#ffa940"
                trackColor={theme.text.secondary}
              />
            </Box>
          </TitledBox>
          <TitledBox
            title="My upcoming Events"
            borderColor={theme.card.border.default}
            titleProps={{ color: theme.card.heading.default }}
            flexDirection="column"
            borderStyle="single"
            minHeight={4}
          >
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <Text color={theme.text.secondary}>No Data</Text>
            </Box>
          </TitledBox>
        </Box>
        <Box flexDirection="column" gap={1} flexGrow={1}>
          <TitledBox
            title="Important Semester Dates"
            borderColor={theme.card.border.default}
            titleProps={{ color: theme.card.heading.default }}
            flexDirection="column"
            borderStyle="single"
            minHeight={4}
          >
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <Text color={theme.text.secondary}>No Data</Text>
            </Box>
          </TitledBox>
          <TitledBox
            title="My upcoming Assessments"
            borderColor={theme.card.border.default}
            titleProps={{ color: theme.card.heading.default }}
            flexDirection="column"
            borderStyle="single"
            minHeight={4}
          >
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <Text color={theme.text.secondary}>No Data</Text>
            </Box>
          </TitledBox>
          <TitledBox
            title="My Project Updates"
            borderColor={theme.card.border.default}
            titleProps={{ color: theme.card.heading.default }}
            flexDirection="column"
            borderStyle="single"
            minHeight={4}
          >
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <Text color={theme.text.secondary}>No Data</Text>
            </Box>
          </TitledBox>
          <TitledBox
            title="My Projects"
            borderColor={theme.card.border.default}
            titleProps={{ color: theme.card.heading.default }}
            flexDirection="column"
            borderStyle="single"
            minHeight={4}
          >
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <Text color={theme.text.secondary}>No Data</Text>
            </Box>
          </TitledBox>
        </Box>
      </Box>
    </Box>
  );
}
