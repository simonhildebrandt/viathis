import React from 'react';
import {
  Heading,
  Text,
  Link,
  Flex,
} from '@chakra-ui/react';

import { useAPISWR } from './api';


export default function Item({ item }) {

  const { data: itemData } = useAPISWR(`/item/${item}`);

  if (!itemData) return 'loading';

  const { title, createdAt, description, link } = itemData;

  return <Flex direction="column" mt={8} gap={4}>
    <Heading>{title}</Heading>
    <Text>{new Date(createdAt).toLocaleString()}</Text>
    <Link href={link} isExternal>{link}</Link>
    <Text>{description}</Text>
  </Flex>
}
