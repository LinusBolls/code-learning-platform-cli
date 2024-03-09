import chalk from 'chalk';
import { Box, Text } from 'ink';
import React, { useRef } from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import Divider from '../../component/Divider.js';
import TitledBox from '../../component/TitledBox.js';
import { useElementSize } from '../../util/useElementSize.js';

export interface SideNavItemProps {
  title: string;
  hotkeys?: string[];

  isActive: boolean;
}
export function SideNavItem({
  title: originalTitle,
  hotkeys,
  isActive,
}: SideNavItemProps) {
  const { theme } = useTheme();

  const navItemRef = useRef(null);

  const { width } = useElementSize(navItemRef);

  const hint = hotkeys?.[0] ? hotkeys[0] + ' ' : '  ';

  const title = ' ' + hint + originalTitle.padEnd(width - 1 - hint.length, ' ');

  const coloredTitle = isActive
    ? chalk
        .bgHex(theme.highlight.active.background)
        .hex(theme.highlight.active.main)(title)
    : chalk.hex(theme.text.default)(title);

  return (
    <Box ref={navItemRef}>
      <Text bold>{coloredTitle}</Text>
    </Box>
  );
}

export interface SideNavProps {
  itemGroups: { title: string; hotkeys?: string[] }[][];
  activeItemIdx: number;
}
export default function SideNav({ itemGroups, activeItemIdx }: SideNavProps) {
  const { theme } = useTheme();

  return (
    <TitledBox
      title="Learning Platform"
      borderColor={theme.card.border.default}
      titleProps={{ color: theme.card.heading.default }}
      flexDirection="column"
      borderStyle="single"
      paddingTop={1}
      width={21}
    >
      {itemGroups.map((itemGroup, index) => {
        const isLast = index === itemGroups.length - 1;

        return (
          <Box flexDirection="column" key={index}>
            {itemGroup.map((item, idx) => {
              const actualIdx = itemGroups
                .flat()
                .findIndex((i) => i.title === item.title);

              return (
                <SideNavItem
                  key={idx}
                  title={item.title}
                  hotkeys={item.hotkeys}
                  isActive={actualIdx === activeItemIdx}
                />
              );
            })}
            {!isLast && <Divider />}
          </Box>
        );
      })}
    </TitledBox>
  );
}
