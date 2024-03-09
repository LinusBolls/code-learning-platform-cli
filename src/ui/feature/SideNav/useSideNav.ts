import { useState } from 'react';

import useInput from '../../../services/useInput/index.js';
import { useNavigation } from '../../../services/useNavigation/index.js';

export interface SideNavItem {
  title: string;
  hotkeys?: string[];
}
export default function useSideNav(
  isActive: boolean,
  itemGroups: SideNavItem[][]
) {
  const [activeItemIdx, setActiveItemIdx] = useState(1);

  const navigation = useNavigation();

  useInput(
    (input) => {
      if (!navigation.canReceiveHotkeys) return;

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
