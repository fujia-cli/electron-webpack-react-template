import { createContext, ReactNode, useContext, useState } from 'react';
import * as auth from './service';
import type { User } from './service';

interface AuthForm {
  username: string;
  password: string;
}

const AuthContext = createContext<{
  user: User | null;
  register: (params: AuthForm) => Promise<any>;
  login: (params: AuthForm) => Promise<any>;
  logout: () => Promise<any>;
  // eslint-disable-next-line indent
} | null>(null);

AuthContext.displayName = 'AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // const login = (params: AuthForm) => auth.login(params).then((user) => setUser(user));
  /**
   * NOTE: point free，即销参，是函数式编程中一个重要的概念
   */
  const login = (params: AuthForm) => auth.login(params).then(setUser);
  const register = (params: AuthForm) => auth.login(params).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth should be used in AuthProvider');
  }

  return context;
};
