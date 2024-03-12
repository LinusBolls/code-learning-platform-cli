import { Box, Text } from 'ink';
import React from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import Breadcrumbs, { BreadcrumbsProps } from '../../component/Breadcrumbs.js';
import Divider from '../../component/Divider.js';
import { ErrorText, LoadingText } from '../../component/LoadingSpinner.js';
import PaginationIndicator from '../../component/PaginationIndicator.js';
import { EventViewModel } from '../../util/mapping.js';
import { QueryDTO } from '../../util/queryDTO.js';

export interface EventsListProps {
  eventsPerPage: number;
  events: QueryDTO<EventViewModel[]>;
  breadcrumbsProps?: Omit<BreadcrumbsProps, 'steps'>;
  columns: { width: number }[];
  currentPage?: number;
  numPages?: number;
  selectedItemId?: string | null;
}
export default function EventsList({
  eventsPerPage,
  events,
  breadcrumbsProps,
  columns,
  currentPage = 0,
  numPages = 1,
  selectedItemId,
}: EventsListProps) {
  const { theme } = useTheme();

  if (events.isLoading)
    return (
      <Box flexDirection="column" flexGrow={1}>
        <Breadcrumbs steps={['Events']} {...breadcrumbsProps} />
        <LoadingText text="Loading events" />
      </Box>
    );

  if (events.isError)
    return (
      <Box flexDirection="column" flexGrow={1}>
        <Breadcrumbs steps={['Events']} {...breadcrumbsProps} />
        <ErrorText />
      </Box>
    );

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Breadcrumbs steps={['Events']} {...breadcrumbsProps} />
      <Box
        flexDirection="column"
        alignItems="center"
        flexGrow={1}
        padding={1}
        height={eventsPerPage + eventsPerPage - 1 + 2}
      >
        {events.data!.length < 1 && (
          <Text color={theme.text.secondary}>No events found.</Text>
        )}
        {events.data!.map((event, idx) => {
          const isLast = idx === events.data!.length - 1;

          const hasDivider = !isLast;

          return (
            <Box
              key={event.id}
              flexDirection="column"
              width="100%"
              height={1 + (hasDivider ? 1 : 0)}
            >
              <EventsTableRow
                columns={columns}
                event={event}
                isActive={event.id === selectedItemId}
              />
              {!isLast && <Divider />}
            </Box>
          );
        })}
      </Box>
      <PaginationIndicator numPages={numPages} currentPage={currentPage} />
    </Box>
  );
}

export interface EventsItemProps {
  event: EventViewModel;
  isActive?: boolean;
}
export function EventsTableRow({
  event,
  isActive = false,
  columns,
}: EventsItemProps & { columns: { width: number }[] }) {
  const { theme } = useTheme();

  const bgColor = isActive ? theme.highlight.active.background : 'undefined';

  const gap = 2;

  return (
    <Box>
      <Box width={columns[0]!.width + gap}>
        <Text
          color={isActive ? theme.highlight.active.main : theme.text.secondary}
          wrap="truncate"
          bold
          backgroundColor={bgColor}
        >
          {(event.creatorName ?? '').padEnd(columns[0]!.width + gap, ' ')}
        </Text>
      </Box>
      <Box width={columns[1]!.width + gap}>
        <Text
          bold={isActive}
          color={isActive ? theme.highlight.active.main : theme.text.default}
          backgroundColor={bgColor}
        >
          {event.title.padEnd(columns[1]!.width + gap, ' ')}
        </Text>
      </Box>
      <Box width={columns[2]!.width + gap}>
        <Text
          bold={isActive}
          color={isActive ? theme.highlight.active.main : theme.text.secondary}
          wrap="truncate"
          backgroundColor={bgColor}
        >
          {(event.participantCount + ' / ' + event.maxParticipants).padEnd(
            columns[2]!.width + gap,
            ' '
          )}
        </Text>
      </Box>
      {/* <Box width={columns[3]!.width}>
        <Text
          bold={isActive}
          color={isActive ? theme.highlight.active.main : theme.text.secondary}
          wrap="truncate"
          backgroundColor={bgColor}
        >
          {(event.category ?? 'haher').padEnd(columns[3]!.width, ' ')}
        </Text>
      </Box> */}
    </Box>
  );
}
