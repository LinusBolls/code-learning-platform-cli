import { Box } from 'ink';
import React from 'react';

import Breadcrumbs from '../../component/Breadcrumbs.js';
import Checkbox from '../../component/Checkbox.js';

export interface SettingsProps {
  preferences: {
    isTableView: boolean;
  };
}
export default function Settings({ preferences }: SettingsProps) {
  return (
    <Box flexDirection="column" flexGrow={1}>
      <Breadcrumbs steps={['Settings']} />
      <Box flexDirection="column" flexGrow={1} paddingTop={1}>
        <Checkbox value={preferences.isTableView} label="T Table view" />
      </Box>
    </Box>
  );
}
