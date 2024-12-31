import React from 'react';
import {
  Flex,
  Heading,
  FormControl,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';

import { api, useAPISWR } from './api';
import FriendLink from './friend-link';


export default function() {
  const { data: friends, mutate } = useAPISWR('/friends');
  const [ newEmail, setEmail ] = React.useState('');
  const toast = useToast();
  const updateEmail = event => setEmail(event.target.value);

  const invite = event => {
    event.preventDefault();
    const email = event.target[0].value;
    api.post('/friends', { email })
    .then(_ => {
      mutate();
      setEmail('');
      toast({
        title: "Friend invited",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    });
  }

  return <Flex direction="column" gap={8}>
    <Heading>Friends</Heading>
    <Flex>
      <form onSubmit={invite}>
        <Flex gap={2}>
        <FormControl>
          <Input type="email" value={newEmail} onChange={updateEmail} placeholder="Invite a friend" required/>
        </FormControl>
        <Button colorScheme="green" type="submit">Invite</Button>
        </Flex>
      </form>
    </Flex>
    <Flex gap={4} flexWrap="wrap" align="stretch">
      {friends && friends.map(friend => <FriendLink key={friend._id} friend={friend} mutate={mutate}/>)}
    </Flex>
  </Flex>
}
