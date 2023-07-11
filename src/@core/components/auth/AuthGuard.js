// ** React Imports
import { useEffect } from 'react';

// ** Next Imports
import { useRouter } from 'next/router';
import authConfig from 'src/configs/auth';

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth';

const AuthGuard = props => {
  const { children, fallback } = props;
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }
      if (!user && !globalThis.localStorage.getItem(authConfig.storageUserDataKeyName)) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/auth/launch',
            query: { returnUrl: router.asPath }
          });
        } else {
          router.replace('/auth/launch');
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  );
  if (loading || !user) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
