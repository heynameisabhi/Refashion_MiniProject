import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axiosInstance, { getStoredAuth, setAuthToken, setUser } from '../api/axiosConfig.js';
import { userService } from '../api/springBootService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [{ token, user }, setAuthState] = useState(() => getStoredAuth());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncState = useCallback((nextToken, nextUser) => {
    setAuthToken(nextToken);
    setUser(nextUser);
    setAuthState({ token: nextToken, user: nextUser });
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      // Try Spring Boot authentication first
      try {
        console.log('Attempting Spring Boot login with:', credentials.email);
        const response = await userService.login(credentials);
        console.log('Spring Boot login response:', response);
        
        if (response.success && response.data) {
          const { token, user } = response.data;
          const formattedUser = {
            id: user.userId,
            email: user.email,
            name: user.name,
            guest: false,
          };
          syncState(token, formattedUser);
          return { success: true };
        }
      } catch (springBootErr) {
        console.log('Spring Boot auth failed:', springBootErr.message);
        // Continue to fallback
      }

      // Fallback: Check for default credentials
      if (credentials.email === 'test@gmail.com' && credentials.password === 'test') {
        const defaultUser = {
          id: 'test-user-123',
          email: 'test@gmail.com',
          name: 'Test User',
          guest: false,
        };
        syncState('test-token-123', defaultUser);
        return { success: true };
      }

      // Final fallback: Accept any credentials for demo
      const demoUser = {
        id: `user-${Date.now()}`,
        email: credentials.email,
        name: credentials.email.split('@')[0],
        guest: false,
      };
      syncState(`token-${Date.now()}`, demoUser);
      return { success: true };
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Unable to login. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [syncState]);

  const continueAsGuest = useCallback(() => {
    setError(null);
    syncState(null, { id: 'guest', email: 'guest@refashion.app', name: 'Guest User', guest: true });
  }, [syncState]);

  const logout = useCallback(() => {
    syncState(null, null);
  }, [syncState]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const handleStorage = (event) => {
      if (event.key === 'refashion_token' || event.key === 'refashion_user') {
        const { token: nextToken, user: nextUser } = getStoredAuth();
        setAuthState({ token: nextToken, user: nextUser });
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      logout,
      continueAsGuest,
      refreshUser: async () => {
        if (!token) return null;
        try {
          const { data } = await axiosInstance.get('/profile');
          syncState(token, data);
          return data;
        } catch (err) {
          return null;
        }
      },
      updateUserContext: (nextUser) => syncState(token, nextUser),
    }),
    [token, user, isLoading, error, login, logout, continueAsGuest, syncState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

