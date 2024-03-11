import { Box, Text } from 'ink';
import React from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import Breadcrumbs, { BreadcrumbsProps } from '../../component/Breadcrumbs.js';
import Divider from '../../component/Divider.js';
import { LoadingText } from '../../component/LoadingSpinner.js';
import Progress from '../../component/Progress.js';
import TitledBox from '../../component/TitledBox.js';

export interface EctsDataPoint {
  collectedECTS: number;
  totalECTSNeeded: number;
}

export interface EctsData {
  capstone: EctsDataPoint;
  thesis: EctsDataPoint;
  sts: EctsDataPoint;
  orientation: EctsDataPoint;
  mandatory: EctsDataPoint;
  compulsoryElective: EctsDataPoint;
  elective: EctsDataPoint;
}

export interface Project {
  isApproved: boolean;
  isArchived: boolean;
  title: string;
  description: string;
  coverUrl: string;
  isLookingForTeammates: boolean;
  tags: { name: string; category: string | null }[];
  semesters: { name: string }[];
  originator: { name: string };
  isFutureProject: boolean;
  activeMemberships: {
    student: { firstName: string; lastName: string; avatarUrl: string };
  }[];
}

export interface DashboardProps {
  ectsData: EctsData | null;
  myProjects: Project[] | null;
  importantSemesterDates:
    | { title: string; subtitle: string; date: string }[]
    | null;
  breadcrumbsProps?: Omit<BreadcrumbsProps, 'steps'>;
}
export default function Dashboard({
  ectsData,
  myProjects,
  importantSemesterDates,
  breadcrumbsProps,
}: DashboardProps) {
  const { theme } = useTheme();

  const boxMinHeight = 5;

  const totalEcts = Object.values(ectsData ?? {}).reduce<EctsDataPoint>(
    (acc, data) => {
      return {
        collectedECTS: acc.collectedECTS + data.collectedECTS,
        totalECTSNeeded: acc.totalECTSNeeded + data.totalECTSNeeded,
      };
    },
    { collectedECTS: 0, totalECTSNeeded: 0 }
  );

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Breadcrumbs steps={['Dashboard']} {...breadcrumbsProps} />
      <Box gap={1} paddingTop={1}>
        <Box flexDirection="column" gap={1} flexGrow={1}>
          <TitledBox title="My Semester" minHeight={4}>
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <Text color={theme.text.secondary}>Coming soon</Text>
            </Box>
          </TitledBox>
          <TitledBox
            title={
              ectsData
                ? `Study Progress (${totalEcts.collectedECTS} / ${totalEcts.totalECTSNeeded} ECTS)`
                : 'Study Progress - Loading'
            }
            paddingX={2}
            paddingY={1}
            minHeight={boxMinHeight}
            gap={1}
          >
            {ectsData ? (
              <>
                <EctsProgressItem
                  title="Orientation Semester"
                  progressColor={theme.module.orientation.main}
                  data={ectsData.orientation}
                />
                <EctsProgressItem
                  title="Mandatory Modules"
                  progressColor={theme.module.core.main}
                  data={ectsData.mandatory}
                />
                <EctsProgressItem
                  title="Compulsory Elective Modules"
                  progressColor={theme.module.core.main}
                  data={ectsData.compulsoryElective}
                />
                <EctsProgressItem
                  title="Elective Modules"
                  progressColor={theme.module.core.main}
                  data={ectsData.elective}
                />
                <EctsProgressItem
                  title="MandatorySTS Modules"
                  progressColor={theme.module.core.main}
                  data={ectsData.sts}
                />
                <EctsProgressItem
                  title="Thesis"
                  progressColor={theme.module.synthesis.main}
                  data={ectsData.thesis}
                />
                <EctsProgressItem
                  title="Capstone Project"
                  progressColor={theme.module.synthesis.main}
                  data={ectsData.capstone}
                />
              </>
            ) : (
              <Box height={20} alignItems="center" justifyContent="center">
                <LoadingText />
              </Box>
            )}
          </TitledBox>
          <TitledBox title="My upcoming Events" minHeight={4}>
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <Text color={theme.text.secondary}>Coming soon</Text>
            </Box>
          </TitledBox>
        </Box>
        <Box flexDirection="column" gap={1} flexGrow={1}>
          <TitledBox title="Important Semester Dates" minHeight={4}>
            {importantSemesterDates ? (
              <Box
                flexGrow={1}
                flexDirection="column"
                paddingX={2}
                paddingY={1}
              >
                {importantSemesterDates?.map((date, idx) => {
                  const isLast = idx === importantSemesterDates.length - 1;
                  return (
                    <Box flexDirection="column" key={idx} flexGrow={1}>
                      <Text color={theme.text.default}>{date.title}</Text>
                      {!isLast && <Divider />}
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Box alignItems="center" justifyContent="center" flexGrow={1}>
                <LoadingText />
              </Box>
            )}
          </TitledBox>
          <TitledBox title="My upcoming Assessments" minHeight={4}>
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <Text color={theme.text.secondary}>Coming soon</Text>
            </Box>
          </TitledBox>
          <TitledBox title="My Project Updates" minHeight={4}>
            <Box flexGrow={1} alignItems="center" justifyContent="center">
              <Text color={theme.text.secondary}>Coming soon</Text>
            </Box>
          </TitledBox>
          <TitledBox title="My Projects" minHeight={4}>
            {myProjects ? (
              <Box
                flexGrow={1}
                flexDirection="column"
                paddingX={2}
                paddingY={1}
              >
                {myProjects?.map((project, idx) => {
                  const isLast = idx === myProjects.length - 1;
                  return (
                    <Box flexDirection="column" key={idx} flexGrow={1}>
                      <Text color={theme.text.default}>{project.title}</Text>
                      {!isLast && <Divider />}
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Box alignItems="center" justifyContent="center" flexGrow={1}>
                <LoadingText />
              </Box>
            )}
          </TitledBox>
        </Box>
      </Box>
    </Box>
  );
}

function EctsProgressItem({
  title,
  progressColor,
  data,
}: {
  title: string;
  progressColor: string;
  data: EctsDataPoint;
}) {
  const { theme } = useTheme();

  return (
    <Box flexDirection="column">
      <Text color={theme.text.default}>
        {title}{' '}
        <Text color={theme.text.secondary}>
          ({data.collectedECTS} / {data.totalECTSNeeded} ECTS)
        </Text>
      </Text>
      <Progress
        progressFloat={data.collectedECTS / data.totalECTSNeeded}
        progressColor={progressColor}
        trackColor={theme.text.secondary}
      />
    </Box>
  );
}
