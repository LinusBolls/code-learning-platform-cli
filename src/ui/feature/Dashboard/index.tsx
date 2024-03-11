import { Box, Text } from 'ink';
import React from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import Breadcrumbs, { BreadcrumbsProps } from '../../component/Breadcrumbs.js';
import Divider from '../../component/Divider.js';
import { ErrorText, LoadingText } from '../../component/LoadingSpinner.js';
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
  coverUrl?: string | null;
  isLookingForTeammates?: boolean | null;
  tags: { name: string; category?: string | null }[];
  semesters?: { name: string }[] | null;
  originator?: { name: string } | null;
  isFutureProject?: boolean | null;
  activeMemberships?:
    | {
        student?: {
          firstName: string;
          lastName: string;
          avatarUrl?: string | null;
        } | null;
      }[]
    | null;
}

export interface DashboardProps {
  myModuleData: {
    isLoading: boolean;
    isError: boolean;
    data?: EctsData | null;
  };
  myProjects: {
    isLoading: boolean;
    isError: boolean;
    data?: Project[] | null;
  };
  importantSemesterDates: {
    isLoading: boolean;
    isError: boolean;
    data?:
      | (
          | { title?: string | null; subtitle?: string | null; date?: string }
          | null
          | undefined
        )[]
      | null;
  };
  followedProjectUpdates: {
    isLoading: boolean;
    isError: boolean;
    data?:
      | ({
          title?: string;
        } | null)[]
      | null;
  };
  mySemesterModules: {
    isLoading: boolean;
    isError: boolean;
    data?:
      | ({
          module?: { title?: string } | null;
        } | null)[]
      | null;
  };
  breadcrumbsProps?: Omit<BreadcrumbsProps, 'steps'>;
}
export default function Dashboard({
  myModuleData,
  myProjects,
  importantSemesterDates,
  followedProjectUpdates,
  mySemesterModules,
  breadcrumbsProps,
}: DashboardProps) {
  const { theme } = useTheme();

  const totalEcts = Object.values(
    myModuleData.data ?? {}
  ).reduce<EctsDataPoint>(
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
              {mySemesterModules.isLoading && <LoadingText />}
              {mySemesterModules.isError && <ErrorText />}
              {mySemesterModules.data?.length === 0 && (
                <Text color={theme.text.secondary}>No data.</Text>
              )}
              {(mySemesterModules.data?.length ?? 0) > 0 && (
                <Box
                  flexGrow={1}
                  flexDirection="column"
                  paddingX={2}
                  paddingY={1}
                >
                  {mySemesterModules.data?.map((update, idx) => {
                    const isLast = idx === myProjects.data!.length - 1;
                    return (
                      <Box flexDirection="column" key={idx} flexGrow={1}>
                        <Text color={theme.text.default}>
                          {update?.module?.title ?? 'Unknown'}
                        </Text>
                        {!isLast && <Divider />}
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </TitledBox>
          <TitledBox
            title={
              myModuleData.data
                ? `Study Progress (${totalEcts.collectedECTS} / ${totalEcts.totalECTSNeeded} ECTS)`
                : 'Study Progress'
            }
            paddingX={2}
            paddingY={1}
            minHeight={20}
            gap={1}
          >
            {myModuleData.isLoading && <LoadingText />}
            {myModuleData.isError && <ErrorText />}
            {myModuleData.data && (
              <>
                <EctsProgressItem
                  title="Orientation Semester"
                  progressColor={theme.module.orientation.main}
                  data={myModuleData.data.orientation}
                />
                <EctsProgressItem
                  title="Mandatory Modules"
                  progressColor={theme.module.core.main}
                  data={myModuleData.data.mandatory}
                />
                <EctsProgressItem
                  title="Compulsory Elective Modules"
                  progressColor={theme.module.core.main}
                  data={myModuleData.data.compulsoryElective}
                />
                <EctsProgressItem
                  title="Elective Modules"
                  progressColor={theme.module.core.main}
                  data={myModuleData.data.elective}
                />
                <EctsProgressItem
                  title="MandatorySTS Modules"
                  progressColor={theme.module.core.main}
                  data={myModuleData.data.sts}
                />
                <EctsProgressItem
                  title="Thesis"
                  progressColor={theme.module.synthesis.main}
                  data={myModuleData.data.thesis}
                />
                <EctsProgressItem
                  title="Capstone Project"
                  progressColor={theme.module.synthesis.main}
                  data={myModuleData.data.capstone}
                />
              </>
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
            {importantSemesterDates.isLoading && <LoadingText />}
            {importantSemesterDates.isError && <ErrorText />}
            {importantSemesterDates.data?.length === 0 && (
              <Text color={theme.text.secondary}>No data.</Text>
            )}
            {(importantSemesterDates.data?.length ?? 0) > 0 && (
              <Box
                flexGrow={1}
                flexDirection="column"
                paddingX={2}
                paddingY={1}
              >
                {importantSemesterDates
                  .data!.filter(Boolean)
                  .map((date, idx) => {
                    const isLast =
                      idx === importantSemesterDates.data!.length - 1;
                    return (
                      <Box flexDirection="column" key={idx} flexGrow={1}>
                        <Text color={theme.text.default}>{date!.title}</Text>
                        {!isLast && <Divider />}
                      </Box>
                    );
                  })}
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
              {followedProjectUpdates.isLoading && <LoadingText />}
              {followedProjectUpdates.isError && <ErrorText />}
              {followedProjectUpdates.data?.length === 0 && (
                <Text color={theme.text.secondary}>No data.</Text>
              )}
              {(followedProjectUpdates.data?.length ?? 0) > 0 && (
                <Box
                  flexGrow={1}
                  flexDirection="column"
                  paddingX={2}
                  paddingY={1}
                >
                  {followedProjectUpdates.data?.map((update, idx) => {
                    const isLast = idx === myProjects.data!.length - 1;
                    return (
                      <Box flexDirection="column" key={idx} flexGrow={1}>
                        <Text color={theme.text.default}>
                          {update?.title ?? 'Unknown'}
                        </Text>
                        {!isLast && <Divider />}
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </TitledBox>
          <TitledBox title="My Projects" minHeight={4}>
            {myProjects.isLoading && <LoadingText />}
            {myProjects.isError && <ErrorText />}
            {myProjects.data?.length === 0 && (
              <Text color={theme.text.secondary}>No data.</Text>
            )}
            {(myProjects.data?.length ?? 0) > 0 && (
              <Box
                flexGrow={1}
                flexDirection="column"
                paddingX={2}
                paddingY={1}
              >
                {myProjects.data?.map((project, idx) => {
                  const isLast = idx === myProjects.data!.length - 1;
                  return (
                    <Box flexDirection="column" key={idx} flexGrow={1}>
                      <Text color={theme.text.default}>{project.title}</Text>
                      {!isLast && <Divider />}
                    </Box>
                  );
                })}
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
