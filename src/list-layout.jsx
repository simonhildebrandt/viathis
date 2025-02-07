import React, { useContext } from "react";
import {
  Box,
  Flex,
  Link,
  useMediaQuery,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { getRouter } from "navigo-react";
import { MdMenu } from "react-icons/md";

import { FolderContext, FolderProvider } from "./folder-context";
import { AuthContext } from './auth';


function WithNavDrawer({children}) {
  const [isThinnerThan800] = useMediaQuery('(max-width: 800px)')
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (isThinnerThan800) {
    return <>
      <Box position="absolute" bottom={8} left={4}>
        <IconButton onClick={onOpen} colorScheme="orange" size="lg" icon={<MdMenu size={48}/>} />
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navigation</DrawerHeader>
          <DrawerBody>
            {children}
          </DrawerBody>
          <DrawerFooter>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  } else {
    return children;
  }
}


function NavLink({children, path}) {
  const nav = () => getRouter().navigate(path);
  const { folder, url } = useContext(FolderContext);

  const selected = path == url;
  const highlightColor = 'gray.500';

  return <Flex
    bgColor={selected ? highlightColor : '#0000'}
    py={2}
    px={4}
    borderRadius={8}
  >
    <Link onClick={nav}>{children}</Link>
  </Flex>
}

export default function({url, folder, children}) {
  const { user: { tags } } = useContext(AuthContext);
  const extendedTags = [...tags, 'untagged'];

  return <FolderProvider folder={folder} url={url}>
    <Flex width="100%" position="relative">
      <WithNavDrawer>
        <Flex direction="column" p={8} fontWeight="bold" gap={6}>
          <Flex direction="column" gap={2}>
            <NavLink path="list/inbox">Inbox</NavLink>
            <NavLink path="list/archived">Archived</NavLink>
            <NavLink path="list/search">Search</NavLink>
          </Flex>
          <Flex direction="column" gap={2}>
            { extendedTags.map(tag => (
              <NavLink key={tag} path={`tag/${encodeURIComponent(tag)}`}>{tag}</NavLink>
            )) }
          </Flex>
          <Flex>
            <NavLink path="friends">Friends</NavLink>
          </Flex>
        </Flex>
      </WithNavDrawer>

      {children}
    </Flex>
  </FolderProvider>
}
