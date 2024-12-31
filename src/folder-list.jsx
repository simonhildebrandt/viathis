import React, { useContext } from 'react';
import {
  Flex,
  Link,
  Heading,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { getRouter } from "navigo-react";

import ItemControls from './item-controls';
import { useAPISWR } from './api';
import { ListProvider } from './folder-context';


const pad = str => str.toString().padStart(2, '0');

function ItemDate({date}) {
  const d = new Date(date);
  return <Tooltip label={d.toLocaleString()}>
    <Flex direction="column" fontFamily="monospace" fontStretch="condensed">
      <Flex>{`${pad(d.getDate())}/${pad(d.getMonth() + 1)}`}</Flex>
      <Flex>{`${pad(d.getHours())}:${pad(d.getMinutes())}`}</Flex>
    </Flex>
  </Tooltip>
}

function Item({item}) {
  const { _id, title, link, description, createdAt } = item;
  const hoverColor = useColorModeValue('white', 'gray.600');

  const displayItem = _ => getRouter().navigate(`/item/${_id}`);

  return <Flex
    direction="row"
    gap={4}
    align="flex-start"
  >
    <Flex
      direction="row"
      gap={4}
      align="center"
      flexGrow={1}
      flexShrink={1}
      borderRadius={16}
      cursor="pointer"
      p={6}
      _hover={{ backgroundColor: hoverColor }}
      onClick={displayItem}
    >
      <ItemDate date={createdAt}/>
      <Flex direction="column" flexShrink={1} flexGrow={1}>
        <Heading size="md">{title}</Heading>
        <Flex py={1} direction="column" gap={2}>
          <Flex>{description}</Flex>
          <Link href={link}>{link}</Link>
        </Flex>
      </Flex>
    </Flex>
    <Flex>
      <ItemControls item={item}/>
    </Flex>
  </Flex>
}

export default function FolderList({folder}) {
  const { data, error, isLoading, mutate } = useAPISWR(`/list/${folder}`, {revalidateOnFocus: false});
  const bgColor = useColorModeValue('gray.100', 'gray.700');

  return <Flex
    overflowY="auto"
    bgColor={bgColor}
    direction="column"
    flexGrow={1}
    flexShrink={1}
  >
    <ListProvider mutate={mutate}>
      <Flex
        direction="column"
        gap={4}
        p={4}
        flexGrow={1}
        flexShrink={1}
      >
        { isLoading == false && data && data.length == 0 && <Heading size="md">No items in this folder</Heading> }
        { data && data.map(item => <Item
          key={item._id}
          item={item}
        />) }
      </Flex>
    </ListProvider>
  </Flex>
}
