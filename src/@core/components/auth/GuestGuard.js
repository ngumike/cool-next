// ** React Imports
import { useEffect } from 'react';
import authConfig from 'src/configs/auth';

// ** Next Imports
import { useRouter } from 'next/router';

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth';

const GuestGuard = props => {
  const { children, fallback } = props;
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (globalThis.localStorage.getItem(authConfig.storageUserDataKeyName)) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route]);
  if (loading || (!loading && user)) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuestGuard;
