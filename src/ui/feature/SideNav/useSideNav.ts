import { useInput } from 'ink';
import { useState } from 'react';

export interface SideNavItem {
  title: string;
  hotkeys?: string[];
}
export default function useSideNav(
  isActive: boolean,
  itemGroups: SideNavItem[][]
) {
  const [activeItemIdx, setActiveItemIdx] = useState(1);

  useInput(
    (input) => {
      const item = itemGroups
        .flat()
        .find((item) => item.hotkeys?.includes(input));

      if (item) {
        const idx = itemGroups.flat().findIndex((i) => i.title === item.title);
        setActiveItemIdx(idx);
      }
    },
    { isActive }
  );

  return {
    itemGroups,
    activeItemIdx,
  };
}
