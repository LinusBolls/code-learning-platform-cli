import { Box, measureElement, Text } from 'ink';
import React, { useEffect, useRef, useState } from 'react';

import { useTheme } from '../../services/useTheme/index.js';

export interface PaginationIndicatorProps {
  numPages: number;
  currentPage?: number;
}

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
      if (acc.width + width > containerWidth) return acc;
      return { ...acc, width: acc.width + width, numTabs: acc.numTabs + 1 };
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

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const size = measureElement(containerRef.current);

      setContainerSize(size);
    }
  }, [containerRef]);

  const numTabs = getNumTabs(containerSize.width, numPages);

  const isTruncated = numPages > numTabs;

  const sacheOffset = Math.max(currentPage - numTabs + 3, 0);

  const isDing = currentPage > numPages - 2;

  return (
    <Box ref={containerRef}>
      {Array.from({ length: numTabs }, (_, idx) => {
        if (isTruncated && idx === numTabs - 2 && currentPage < numPages - 2)
          return <PaginationTab key={idx} text="..." />;

        if (isTruncated && idx === numTabs - 1)
          return <PaginationTab key={idx} text={numPages + 1} />;

        return (
          <PaginationTab
            key={idx}
            text={idx + 1 + sacheOffset}
            isActive={
              isDing
                ? idx + sacheOffset === currentPage + 1
                : idx + sacheOffset === currentPage
            }
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
