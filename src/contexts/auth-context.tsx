import React, { createContext, FC, useEffect, useState } from 'react';
import nookies from 'nookies';
import { USER_TOKEN_COOKIE } from '../utils/constants';
import { request } from '../utils/request';

type User = {
  email: string;
  _id: string;
  isAdmin: boolean;
  name: string;
};

type AuthContextData = {
  token: string;
  loggedUser?: User;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
};

const AuthContext = createContext({} as AuthContextData);

const AuthProvider: FC = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState<User>();
  const [token, setToken] = useState('');

  const loginUser = (user: User, tokenReceived: string) => {
    request.defaults.headers.common.authorization = 'Bearer ' + tokenReceived;
    setLoggedUser(user);
    setToken(tokenReceived);
    nookies.set(null, USER_TOKEN_COOKIE, tokenReceived);
  };

  const logoutUser = () => {
    request.defaults.headers.common.authorization = '';
    setLoggedUser(undefined);
    setToken('');
    nookies.destroy(null, USER_TOKEN_COOKIE);
  };

  useEffect(() => {
    const { USER_TOKEN } = nookies.get(null);
    if (!USER_TOKEN) return;

    const authUser = async () => {
      const { data } = await request.get('auth', {
        headers: { Authorization: 'Bearer ' + USER_TOKEN },
      });
      if (!data.isValid) return;
      request.defaults.headers.common.authorization = 'Bearer ' + USER_TOKEN;
      setLoggedUser(data.user);
      setToken(USER_TOKEN);
    };

    authUser();
  }, []);

  return (
    <AuthContext.Provider value={{ loginUser, logoutUser, token, loggedUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
