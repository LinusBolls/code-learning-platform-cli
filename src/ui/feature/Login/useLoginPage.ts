import { logger } from '../../../services/useFileSystem/index.js';
import { useLearningPlatform } from '../../../services/useLearningPlatform/index.js';
import { LoginProps } from './index.js';

function fetchRetryTwice(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  logger.log('fetch (attempt 1):', input, init);

  return fetch(input, init)
    .catch(() => {
      logger.log('fetch (attempt 2):', input, init);

      return fetch(input, init);
    })
    .catch(() => {
      logger.log('fetch (attempt 3):', input, init);

      return fetch(input, init);
    });
}

export default function useLoginPage(): LoginProps {
  const { signInWithRefreshToken } = useLearningPlatform({
    clientOptions: { fetch: fetchRetryTwice },
  });

  return {
    signInWithRefreshToken,
  };
}
