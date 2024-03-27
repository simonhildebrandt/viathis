import React, { useState, createContext, useEffect } from 'react';

import { getTokenAndState, clearTokenAndState } from './utils';
import { api, setToken } from './api';


export const AuthContext = createContext({nextUserPath: '/'});

export const UserContext = ({waiting, children, returnTo}) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const { token, state } = getTokenAndState();
  const { next: nextUserPath = '/' } = JSON.parse(state || "{}") || {};
  useEffect(() => {
    setToken(token);
    api.get('/profile')
      .then(({data}) => {
        setUser(data);
      })
      .finally(_ => setChecking(false));
  }, []);

  if (checking) return waiting;

  function logout() {
    clearTokenAndState();
    setUser(null);
  }

  const data = {
    user,
    nextUserPath,
    logout
  }

  return <AuthContext.Provider value={data}>
    {children}
  </AuthContext.Provider>;
}
