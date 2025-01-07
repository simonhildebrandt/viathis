import React from 'react';
import {
  Flex,
  Select,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { MdCancel } from "react-icons/md";

import FriendSelect from './friend-select';


export default function({isOpen, hide}) {

  if (!isOpen) return null;

  return <Flex gap={2} borderRadius={8} bgColor="gray.300" p={4}>
      <FriendSelect onChange={console.log}/>
      <Button colorScheme="green">Share</Button>
      <IconButton icon={<MdCancel/>} onClick={hide} />
    </Flex>
}
