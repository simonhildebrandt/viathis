import React, { useEffect } from 'react';
import {
  Select,
  Skeleton,
} from '@chakra-ui/react';

import { useAPISWR } from './api';


export default function FriendSelect({ onChange }) {
  const { data: friends, isLoading } = useAPISWR(`/friends`);
  const options = friends && friends.map(f => f.them).filter(f => f.active);

  useEffect(() => {
    const firstOption = options && options[0];
    firstOption && onChange(firstOption.id);
  }, [friends]);

  if (isLoading) {
    return <Skeleton height={10}/>
  }

  if (options.length == 0) {
    return "Invite some friends before trying to share items with them."
  }

  return <Select onChange={e => onChange(e.target.value)}>
    { options.map(({id, idOrName}) => (
      <option key={id} value={id}>{idOrName}</option>
    )) }
  </Select>
}
