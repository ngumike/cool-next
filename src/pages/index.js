// ** React Imports
import { useEffect } from 'react';

// ** Next Imports
import { useRouter } from 'next/router';

// ** Spinner Import
import Spinner from 'src/@core/components/spinner';

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth';

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = role => {
  return '/home';
};

const Home = () => {
  // ** Hooks
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user && user.role) {
      const homeRoute = getHomeRoute(user.role);

      // Redirect user to Home URL
      router.replace(homeRoute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Spinner sx={{ height: '100%' }} />;
};

export default Home;
