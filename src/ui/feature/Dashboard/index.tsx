import { Box, Text } from 'ink';
import React from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import Breadcrumbs from '../../component/Breadcrumbs.js';
import LoadingSpinner from '../../component/LoadingSpinner.js';
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

export interface DashboardProps {
  ectsData: EctsData | null;
}
export default function Dashboard({ ectsData }: DashboardProps) {
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
            title={
              ectsData
                ? `Study Progress (${totalEcts.collectedECTS} / ${totalEcts.totalECTSNeeded} ECTS)`
                : 'Study Progress - Loading'
            }
            borderColor={theme.card.border.default}
            titleProps={{ color: theme.card.heading.default }}
            flexDirection="column"
            borderStyle="single"
            paddingX={2}
            paddingY={1}
            minHeight={boxMinHeight}
            gap={1}
          >
            {ectsData ? (
              <>
                <EctsProgressItem
                  title="Orientation Semester"
                  progressColor="#a0d911"
                  data={ectsData.orientation}
                />
                <EctsProgressItem
                  title="Mandatory Modules"
                  progressColor="#1890ff"
                  data={ectsData.mandatory}
                />
                <EctsProgressItem
                  title="Compulsory Elective Modules"
                  progressColor="#1890ff"
                  data={ectsData.compulsoryElective}
                />
                <EctsProgressItem
                  title="Elective Modules"
                  progressColor="#1890ff"
                  data={ectsData.elective}
                />
                <EctsProgressItem
                  title="MandatorySTS Modules"
                  progressColor="#1890ff"
                  data={ectsData.sts}
                />
                <EctsProgressItem
                  title="Thesis"
                  progressColor="#ffa940"
                  data={ectsData.thesis}
                />
                <EctsProgressItem
                  title="Capstone Project"
                  progressColor="#ffa940"
                  data={ectsData.capstone}
                />
              </>
            ) : (
              <Box height={20} alignItems="center" justifyContent="center">
                <LoadingSpinner type="dots" color={theme.text.secondary} />
              </Box>
            )}
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
      <Text>
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
