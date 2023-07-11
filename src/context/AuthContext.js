// ** React Imports
import { createContext, useEffect, useState, useRef } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** Config
import authConfig from 'src/configs/auth';
import { authApi } from 'src/services/api/auth';

// ** Defaults
const defaultProvider = {
  user: null,
  potentialUser: null,
  loading: true,
  socket: null,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  verifyEmail: () => Promise.resolve(),
  activate: () => Promise.resolve()
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const [loading, setLoading] = useState(defaultProvider.loading);
  const [user, setUser] = useState(defaultProvider.user);
  const [potentialUser, setPotentialUser] = useState(defaultProvider.potentialUser);

  // ** Hooks
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const storedToken = globalThis.localStorage.getItem('accessToken');
      if (!storedToken) {
        setLoading(false);
        router.push('/auth/launch');
      } else {
        const { data, ok } = await authApi.me();
        if (!ok) {
          setUser(null);
          setLoading(false);
          globalThis.localStorage.removeItem('userData');
          globalThis.localStorage.removeItem('accessToken');
          globalThis.localStorage.removeItem('refreshToken');
          router.push('/auth/launch');
        } else {
          const user = data?.data;
          setUser(user);
        }
        setLoading(false);
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (payload, errorCallback) => {
    const { data, ok } = await authApi.login(payload);
    if (!ok) {
      throw data.message;
    } else {
      const { user, token } = data.data;
      if (payload.rememberMe) {
        globalThis.localStorage.setItem('accessToken', token.accessToken);
        globalThis.localStorage.setItem('refreshToken', token.refreshToken);
      }
      const returnUrl = router.query.returnUrl;
      setUser({ ...user });
      setPotentialUser(null);
      payload.rememberMe ? globalThis.localStorage.setItem('userData', JSON.stringify(user)) : null;
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';
      router.replace(redirectURL);
    }
  };

  const handleActivate = async (payload, errorCallback) => {
    const { data, ok } = await authApi.activate(payload.id, payload);
    if (!ok) {
      if (errorCallback) errorCallback(data);
    }

    const { user, token } = data.data;
    globalThis.localStorage.setItem('accessToken', token.accessToken);
    globalThis.localStorage.setItem('refreshToken', token.refreshToken);
    setUser({ ...user });
    setPotentialUser(null);
    router.replace('/');
  };

  const handleVerifyEmail = async payload => {
    const { data, ok } = await authApi.verify(payload);
    if (!ok) {
      throw data.message;
    }

    const potentialUser = data.data;
    setPotentialUser(potentialUser);

    switch (potentialUser.redirect) {
      case 'login':
        router.replace('/auth/login');
        break;
      case 'register':
        router.replace('/auth/register');
        break;
      default:
        throw 'Something went wrong. Please contact admin.';
    }
  };

  const handleLogout = () => {
    setUser(null);
    globalThis.localStorage.removeItem(authConfig.storageUserDataKeyName);
    globalThis.localStorage.removeItem(authConfig.storageTokenKeyName);
    router.push('/auth/launch');
  };

  const handleRegister = async params => {
    const { data, ok } = await authApi.register(params);
    if (!ok) {
      throw new Error(data.message);
    } else {
      if (data.error) {
        throw new Error(data.error);
      } else {
        handleLogin({ email: params.email, password: params.password });
      }
    }
  };

  const values = {
    user,
    loading,
    potentialUser,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    verifyEmail: handleVerifyEmail,
    activate: handleActivate
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
