import React from 'react';
import {
  ChakraProvider,
  ColorModeScript,
  Flex,
  CircularProgress,
} from '@chakra-ui/react'

import { handleToken } from './utils';
import Routes from './routes';
import { UserContext } from './auth';
import Header from './header';
import theme from './theme';
import ShareButton from './share-button';


handleToken(token => setToken(token));


function CheckingLogin() {
  return <Flex gap={8}direction="column" width="100%" height="100%" justifyContent="center" alignItems="center">
    <CircularProgress isIndeterminate size={16}/>
    <Flex>Checking login...</Flex>
  </Flex>
}

export default App = () => {
  return <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <UserContext waiting={<CheckingLogin/>}>
        <Flex width="100%" height="100%" direction="column">
          <Header/>
          <Flex flexGrow={1} flexShrink={1} overflow="hidden" width="100%">
            <Routes/>
            <ShareButton/>
          </Flex>
        </Flex>
      </UserContext>
    </ChakraProvider>
  </>
};
