import { useLearningPlatform } from '../../../services/useLearningPlatform/index.js';
import { LoginProps } from './index.js';

export default function useLoginPage(): LoginProps {
  const { signInWithAccessToken } = useLearningPlatform();

  return {
    onAccessTokenSubmit: signInWithAccessToken,
  };
}
