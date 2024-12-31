import React, { useContext, useRef } from 'react'
import {
  Image,
  IconButton,
  Button,
  useColorMode,
  Flex,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { SunIcon, MoonIcon, SettingsIcon } from '@chakra-ui/icons'

import { AuthContext } from './auth';


const UserOptions = () => {
  const { user, logout } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  if (!user) return;

  return <>
    <Button ref={btnRef} onClick={onOpen}>{user.name}</Button>
    <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex align="center" gap={2}>
              <SettingsIcon/>
              {user.name} - {user.email}
            </Flex>
          </DrawerHeader>
          <DrawerBody>
          </DrawerBody>
          <DrawerFooter>
            <Button onClick={logout}>Logout</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
  </>
}

export default function() {
  const { colorMode, toggleColorMode } = useColorMode()

  return <Flex p={2} align="center" justify="space-between">
    <a href="/"><Image boxSize='64px' src="/logo.svg"/></a>
    <Flex gap={2}>
      <UserOptions/>
      <IconButton onClick={toggleColorMode} icon={colorMode === 'light' ? <SunIcon/> : <MoonIcon/> }/>
    </Flex>
  </Flex>
}
