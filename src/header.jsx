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
  Switch,
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
import TagEditor from './tag-editor';


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
    await api.post('/profile', { name: newName });
    setIsLoading(false);
  }

  async function saveTags(tags) {
    await api.post('/profile', { tags });
  }

  if (!user) return;

  const { tags } = user;

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
            <Flex gap={4} direction="column">
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
              <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='tags' mb='0'>
                  Favourite tags
                </FormLabel>
                <Flex flexGrow={1} direction="column">
                  <TagEditor tags={tags} onChange={saveTags}/>
                </Flex>
              </FormControl>
              <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='notifications' mb='0'>
                  Enable share notifications?
                </FormLabel>
                <Switch id='notifications' isChecked={true} onChange={e => console.log({e})} />
              </FormControl>
            </Flex>
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
