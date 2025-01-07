import React, { useState } from 'react';
import {
  Heading,
  Text,
  Link,
  Flex,
  Textarea,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

import FriendSelect from './friend-select';
import { api } from './api';


export default function({isOpen, hide, id, onShare}) {
  const [userId, setUserId] = useState(null);
  const [shareMessage, setShareMessage] = useState('');
  const [result, setResult] = useState(null);
  const error = (typeof result == 'string') ? result : false;

  function share (){
    api.post(`/share/${id}`, { userId, shareMessage})
    .then(_ => setSuccess(true))
    .catch(({response}) => {
      setResult(response?.data?.message || 'Error sharing link.')
    });
  };

  function updateShareMessage(e) {
    setShareMessage(e.target.value);
  }

  return <Modal isOpen={isOpen} onClose={hide}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Share item</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Flex direction="column"  gap={4}>
          <FriendSelect onChange={setUserId}/>
          <FormControl>
            <FormLabel>Message</FormLabel>
            <Textarea type="text" placeholder="(optional)" value={shareMessage} onChange={updateShareMessage}/>
          </FormControl>
          { result === true && <Alert status='success'>
              <AlertIcon />
              <AlertTitle>Link shared!</AlertTitle>
            </Alert>
          }
          { error && <Alert status='error'>
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          }
        </Flex>
      </ModalBody>

      <ModalFooter as={Flex} justify="space-between">
        <Button colorScheme='gray' mr={3} onClick={hide}>Close</Button>
        <Button isDisabled={!userId} colorScheme='green' mr={3} onClick={share}>Share</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
}
