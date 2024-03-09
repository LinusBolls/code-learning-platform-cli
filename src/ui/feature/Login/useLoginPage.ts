import { useLearningPlatform } from '../../../services/useLearningPlatform/index.js';

export default function useLoginPage() {
  const { signInWithAccessToken } = useLearningPlatform();

  return {
    onAccessTokenSubmit: signInWithAccessToken,
  };
}
