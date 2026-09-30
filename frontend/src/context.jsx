import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { subscribeToAuth, logout as logoutUser } from './services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ loading: true, user: null, profile: null });

  useEffect(() => {
    const unsubscribe = subscribeToAuth(({ user, profile }) => setAuthState({ loading: false, user, profile }));
    return unsubscribe;
  }, []);

  const value = useMemo(() => ({
    ...authState,
    logout: logoutUser,
  }), [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
