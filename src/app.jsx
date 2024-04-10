import React, { useState, useEffect, createContext, useContext } from 'react';
import { ChakraProvider, Image } from '@chakra-ui/react'

import { handleToken } from './utils';
import Routes from './routes';
import { UserContext, AuthContext } from './auth';


handleToken(token => setToken(token));

const loginKey = LWL_KEY;

const UserOptions = () => {
  const { user, logout } = useContext(AuthContext);

  return <>{ JSON.stringify(user)}
    { user ?
      <button onClick={logout}>Logout</button> :
      <a href={`https://login-with.link//#/login/${loginKey}`}>Login</a>
    }
  </>
}


export default App = () => {
  return <ChakraProvider>
    <a href="/"><Image src="logo.svg"/></a>
    <a href="/list">list</a>
    <UserContext waiting="waiting">
      <UserOptions/>
      <Routes/>
    </UserContext>
  </ChakraProvider>;
};
