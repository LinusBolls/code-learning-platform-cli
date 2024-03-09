import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Link from 'ink-link';
import React, { useState } from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import TextInput from '../../component/TextInput.js';

export interface LoginProps {
  onAccessTokenSubmit: (accessToken: string) => void;
}
export default function Login({ onAccessTokenSubmit }: LoginProps) {
  const { theme } = useTheme();

  const [accessToken, setAccessToken] = useState('');

  function onSubmit() {
    onAccessTokenSubmit(accessToken);
  }

  return (
    <Box flexDirection="column">
      <BigText text="CODE" colors={[theme.primary.main]} />
      <Box>
        <Text>
          Please paste your{' '}
          <Link url="https://github.com/linusBolls/code-university-sdk">
            <Text color={theme.link.main} underline={false}>
              access token
            </Text>
          </Link>{' '}
          for the CODE Learning Platform:{' '}
        </Text>
        <TextInput
          value={accessToken}
          onChange={setAccessToken}
          onSubmit={onSubmit}
          type="password"
        />
      </Box>
    </Box>
  );
}
