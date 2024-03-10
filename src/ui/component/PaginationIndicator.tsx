import { Box, Text } from 'ink';
import React, { useRef } from 'react';

import { useTheme } from '../../services/useTheme/index.js';
import { useElementSize } from '../util/useElementSize.js';

export interface PaginationIndicatorProps {
  numPages: number;
  currentPage?: number;
}

/**
 * the amount of tabs that can physically fit in the container
 */
const getNumTabs = (containerWidth: number, numPages: number) => {
  // maps each page to the width it will take up as a `PaginationTab`
  const widths = Array.from({ length: numPages })
    .fill(null)
    .map((_, idx) => {
      const contentLength = (idx + 1).toString().length;

      return contentLength + 2;
    });

  return widths.toReversed().reduce(
    (acc, width) => {
      if (acc.width + width >= containerWidth) return acc;
      return { width: acc.width + width, numTabs: acc.numTabs + 1 };
    },
    { numTabs: 0, width: 0 }
  ).numTabs;
};

/**
 * automatically calculates the amounts of tabs to display if the container is too small to fit all of them
 */
export default function PaginationIndicator({
  numPages,
  currentPage = 0,
}: PaginationIndicatorProps) {
  const containerRef = useRef(null);

  const containerSize = useElementSize(containerRef);

  const numTabs = getNumTabs(containerSize.width, numPages);

  const isTruncated = numPages > numTabs;

  const isLastOrSecondToLast = currentPage >= numPages - 2;
  const isLessThanThirdToLast = currentPage < numPages - 3;

  const pagesNotDisplayed = isLastOrSecondToLast
    ? numPages - numTabs
    : Math.max(currentPage - numTabs + 3, 0);

  if (numPages <= 1) return null;

  return (
    <Box ref={containerRef}>
      {Array.from({ length: numTabs }, (_, tabIdx) => {
        const pageIdx = tabIdx + pagesNotDisplayed;

        if (isTruncated && tabIdx === numTabs - 2 && isLessThanThirdToLast)
          return <PaginationTab key={tabIdx} text="..." />;

        if (isTruncated && tabIdx === numTabs - 1)
          return (
            <PaginationTab
              key={tabIdx}
              text={numPages}
              isActive={currentPage === numPages - 1}
            />
          );

        return (
          <PaginationTab
            key={tabIdx}
            text={pageIdx + 1}
            isActive={currentPage === pageIdx}
          />
        );
      })}
    </Box>
  );
}

interface PaginationTabProps {
  text: string | number;
  isActive?: boolean;
}
function PaginationTab({ text, isActive = false }: PaginationTabProps) {
  const { theme } = useTheme();

  const contentLength = text.toString().length;

  return (
    <Box
      width={contentLength + 2}
      height={3}
      borderColor={
        isActive ? theme.input.border.active : theme.input.border.default
      }
      borderStyle="single"
      alignItems="center"
      justifyContent="center"
    >
      <Text
        color={
          isActive ? theme.card.heading.active : theme.card.heading.default
        }
      >
        {text}
      </Text>
    </Box>
  );
}
