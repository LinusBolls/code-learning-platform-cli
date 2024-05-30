import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Link from 'ink-link';
import React, { useState } from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import TextInput from '../../component/TextInput.js';

export interface LoginProps {
  signInWithRefreshToken: (refreshToken: string) => void;
}
export default function Login({ signInWithRefreshToken }: LoginProps) {
  const { theme } = useTheme();

  const [refreshToken, setRefreshToken] = useState('');

  function onSubmit() {
    signInWithRefreshToken(refreshToken);
  }

  return (
    <Box flexDirection="column">
      <BigText text="CODE" colors={[theme.primary.main]} />
      <Box>
        <Text color={theme.text.default}>
          Please paste your{' '}
          <Link url="https://github.com/linusBolls/code-university-sdk">
            <Text color={theme.link.main} underline={false}>
              refresh token
            </Text>
          </Link>{' '}
          for the CODE Learning Platform:{' '}
        </Text>
        <TextInput
          value={refreshToken}
          onChange={setRefreshToken}
          onSubmit={onSubmit}
          type="password"
        />
      </Box>
    </Box>
  );
}
