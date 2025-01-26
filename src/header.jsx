import React, { useContext, useRef, useEffect, useState } from 'react'
import {
  Image,
  IconButton,
  Button,
  useColorMode,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { SunIcon, MoonIcon, SettingsIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons'

import { AuthContext } from './auth';
import { api } from './api';


const UserOptions = () => {
  const { user, logout } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const btnRef = useRef();

  useEffect(() => {
    if (user) {
      setNewName(user.name);
    }
  }, [user]);

  function updateName(event) {
    setNewName(event.target.value)
  }

  function resetName() {
    setNewName(user.name)
  }

  async function saveName() {
    setIsLoading(true);
    await api.post('/profile/name', { name: newName });
    setIsLoading(false);
  }

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
              {user.email}
            </Flex>
          </DrawerHeader>
          <DrawerBody>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Flex gap={2}>
              <Input type='text' value={newName} onChange={updateName} />
              <IconButton
                colorScheme="green"
                isDisabled={newName === user.name}
                icon={<CheckIcon/>}
                isLoading={isLoading}
                onClick={saveName}
              />
              <IconButton
                colorScheme="red"
                isDisabled={newName === user.name}
                icon={<CloseIcon/>}
                isLoading={isLoading}
                onClick={resetName}
              />
            </Flex>
          </FormControl>
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
