import React, { useContext } from 'react';
import {
  Flex,
  Text,
  Heading,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';

import { AuthContext } from './auth';
import { api } from './api';



function UserTag({id}) {
  return <div>{id}</div>
}

function EmailTag({email}) {
  return <div>{email}</div>
}

export default function({friend, mutate}) {
  const { user: { lwlId } } = useContext(AuthContext);

  const bgColor = useColorModeValue('gray.100', 'gray.700');

  const {
    _id,
    createdAt,
    createdBy,
    inviteeId,
    inviteeEmail,
    acceptedAt,
    cancelledAt,
    cancelledBy,
  } = friend;

  let them, canAccept = false, canUncancel = false;
  if (createdBy === lwlId) {
    them = { id: inviteeId, email: inviteeEmail };
    canUncancel = cancelledAt && cancelledBy == lwlId;
  } else {
    them = { id: createdBy };
    canAccept = !acceptedAt || cancelledBy == lwlId;
  }

  let status;
  if (cancelledAt) {
    status = cancelledBy == lwlId ? 'cancelled by you' : 'cancelled by them';
  } else if (acceptedAt) {
    status = 'accepted';
  } else {
    status = 'pending';
  }

  const change = action => () => {
    api.post(`/friends/${_id}`, {action}).then(_ => mutate());
  }

  return <Flex
    direction="column"
    bgColor={bgColor}
    p={4}
    borderRadius={8}
    width="256px"
    gap={2}
  >
    <Heading size="md">{ them.id ? <UserTag {...them}/> : <EmailTag {...them}/>}</Heading>
    { canAccept && <Button onClick={change('accept')} colorScheme="green">Accept</Button> }
    { !cancelledAt && <Button onClick={change('cancel')} colorScheme="blue">Cancel</Button> }
    { canUncancel && <Button onClick={change('uncancel')} colorScheme="pink">Uncancel</Button> }
    { status && <Text>{status}</Text> }
  </Flex>
}
