import React from 'react';
import { Flex } from '@chakra-ui/react';


export default function({tags}) {
  return <Flex>
    { tags.join(', ') }
  </Flex>
}
