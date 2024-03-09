import { useInput } from 'ink';
import { useState } from 'react';

export interface SideNavItem {
  title: string;
}
export default function useSideNav(isActive: boolean, items: SideNavItem[]) {
  const [activeItemIdx, setActiveItemIdx] = useState(1);

  useInput(
    (input, key) => {
      if (key.upArrow || input === 'k') {
        setActiveItemIdx((prev) => (prev > 0 ? prev - 1 : prev));
      }
      if (key.downArrow || input === 'j') {
        setActiveItemIdx((prev) => (prev < items.length - 1 ? prev + 1 : prev));
      }
    },
    { isActive }
  );

  return {
    isActive,
    items,
    activeItemIdx,
  };
}
