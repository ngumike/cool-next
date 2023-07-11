/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

// ** Next Imports
import Head from 'next/head';
import { Router } from 'next/router';

// ** Store Imports
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'src/store';
import { useSelector } from 'react-redux';

// ** Loader Import
import NProgress from 'nprogress';

// ** Emotion Imports
import { CacheProvider } from '@emotion/react';

// ** Config Imports
import 'src/configs/i18n';
import { defaultACLObj } from 'src/configs/acl';
import themeConfig from 'src/configs/themeConfig';

// ** Third Party Import
import { Toaster } from 'react-hot-toast';

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout';
import AclGuard from 'src/@core/components/auth/AclGuard';
import ThemeComponent from 'src/@core/theme/ThemeComponent';
import AuthGuard from 'src/@core/components/auth/AuthGuard';
import GuestGuard from 'src/@core/components/auth/GuestGuard';
import WindowWrapper from 'src/@core/components/window-wrapper';

// ** Spinner Import
import Spinner from 'src/@core/components/spinner';

import { Backdrop, CircularProgress } from '@mui/material';

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext';
import { SocketProvider } from 'src/context/SocketContext';
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext';

// ** Styled Components
import { SnackbarProvider } from 'notistack';
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast';

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache';

// ** Prismjs Styles
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'simplebar-react/dist/simplebar.min.css';

import 'src/iconify-bundle/icons-bundle-react';

// ** Global css styles
import '../../styles/globals.css';

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start();
  });
  Router.events.on('routeChangeError', () => {
    NProgress.done();
  });
  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });
}

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>;
  }
};

const AppContext = ({ Component, pageProps }) => {
  // Hooks

  // Store
  const { loading } = useSelector(state => state.main);

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false;

  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>);
  const setConfig = Component.setConfig ?? undefined;
  const authGuard = Component.authGuard ?? true;
  const guestGuard = Component.guestGuard ?? false;
  const aclAbilities = Component.acl ?? defaultACLObj;

  return (
    <AuthProvider>
      <SocketProvider>
        <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <ThemeComponent settings={settings}>
                  <SnackbarProvider
                    maxSnack={3}
                    autoHideDuration={2000}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                  >
                    <WindowWrapper>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                          {getLayout(<Component {...pageProps} />)}
                        </AclGuard>
                      </Guard>
                    </WindowWrapper>
                  </SnackbarProvider>
                  <ReactHotToast>
                    <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                  </ReactHotToast>
                  <Backdrop
                    sx={{
                      color: '#fff',
                      zIndex: theme => theme.zIndex.drawer + 999
                    }}
                    open={loading}
                  >
                    <CircularProgress color='inherit' />
                  </Backdrop>
                </ThemeComponent>
              );
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

const App = props => {
  const { emotionCache = clientSideEmotionCache } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.appName}`}</title>
        <meta name='robots' content='noindex,nofollow' />
        <meta name='description' content={`${themeConfig.appName}`} />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <ReduxProvider store={store}>
        <AppContext {...props} />
      </ReduxProvider>
    </CacheProvider>
  );
};

export default App;
