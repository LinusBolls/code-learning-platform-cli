import chalk from 'chalk';
import { Box, Text } from 'ink';
import React, { useRef } from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import TitledBox from '../../component/TitledBox.js';
import { useElementSize } from '../../util/useElementSize.js';

export interface SideNavItemProps {
  title: string;

  isActive: boolean;
  isNavActive: boolean;
}
export function SideNavItem({
  title: originalTitle,
  isActive,
  isNavActive,
}: SideNavItemProps) {
  const { theme } = useTheme();

  const navItemRef = useRef(null);

  const { width } = useElementSize(navItemRef);

  const title = ' ' + originalTitle.padEnd(width - 1, ' ');

  const coloredTitle = isActive
    ? chalk
        .bgHex(
          isNavActive
            ? theme.highlight.active.background
            : theme.highlight.main.background
        )
        .hex(
          isNavActive ? theme.highlight.active.main : theme.highlight.main.main
        )(title)
    : chalk.hex(theme.text.default)(title);

  return (
    <Box ref={navItemRef} paddingTop={1}>
      <Text bold>{coloredTitle}</Text>
    </Box>
  );
}

export interface SideNavProps {
  isActive?: boolean;
  items: { title: string }[];
  activeItemIdx: number;
}
export default function SideNav({
  isActive = true,
  items,
  activeItemIdx,
}: SideNavProps) {
  const { theme } = useTheme();

  const borderColor = isActive
    ? theme.card.border.active
    : theme.card.border.default;
  const titleColor = isActive
    ? theme.card.heading.active
    : theme.card.heading.default;

  return (
    <TitledBox
      title="Menu"
      borderColor={borderColor}
      titleProps={{ color: titleColor }}
      flexDirection="column"
      borderStyle="single"
    >
      {items.map((item, index) => (
        <SideNavItem
          key={index}
          {...item}
          isActive={index === activeItemIdx}
          isNavActive={isActive}
        />
      ))}
    </TitledBox>
  );
}
