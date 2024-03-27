import React, { useState, useEffect, createContext, useContext } from 'react';
import { ChakraProvider, Image } from '@chakra-ui/react'

import { handleToken } from './utils';
import Routes from './routes';
import { UserContext, AuthContext } from './auth';


handleToken(token => setToken(token));


const UserOptions = () => {
  const { user, logout } = useContext(AuthContext);

  return <>{ JSON.stringify(user)}
    { user ?
      <button onClick={logout}>Logout</button> :
      <a href="https://login-with.link//#/login/d35cbfe3-698d-4fa8-a6cf-e8b3dc3b6ba0">Login</a>
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
