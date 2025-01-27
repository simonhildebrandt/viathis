import React, { useContext } from 'react';
import {
  Flex,
  Link,
  Heading,
  Tooltip,
  Skeleton,
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

function Item({item, mutate}) {
  const { _id, title, link, description, createdAt } = item;
  const hoverColor = useColorModeValue('white', 'gray.600');

  const displayItem = _ => getRouter().navigate(`/item/${_id}`);

  return <Flex
    direction={"row"}
    gap={[4, 8]}
    align="flex-start"
  >
    <Flex
      direction="row"
      gap={[4, 8]}
      align="center"
      flexGrow={1}
      flexShrink={1}
      borderRadius={16}
      cursor="pointer"
      p={[4, 6]}
      _hover={{ backgroundColor: hoverColor }}
      onClick={displayItem}
    >
      <ItemDate date={createdAt}/>
      <Flex direction="column" flexShrink={1} flexGrow={1}>
        <Heading wordBreak="break-all" fontSize={[16, 20]}>{title}</Heading>
        <Flex minWidth="0" flex={1} fontSize={[12, 14]} py={1} direction="column" gap={2}>
          <Flex wordBreak="break-all">{description}</Flex>
          <Link wordBreak="break-all" href={link} isExternal>{link}</Link>
        </Flex>
      </Flex>
    </Flex>
    <Flex>
      <ItemControls item={item} mutate={mutate}/>
    </Flex>
  </Flex>
}

export default function FolderList({folder}) {
  const { data, isLoading, mutate } = useAPISWR(`/list/${folder}`, {revalidateOnFocus: false});
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
        p={[2, 4]}
        flexGrow={1}
        flexShrink={1}
      >
        { isLoading == false && data && data.length == 0 && (
          <Flex p={8} justify="center">
            <Heading color="gray" size="md">No items in this folder</Heading>
          </Flex>
        )}
        { data ? data.map(item => <Item
          key={item._id}
          item={item}
          mutate={mutate}
        />) : (
          <>
            { Array.from({length: 5}).map((_, i) => <Skeleton key={i} height={16}/>) }
          </>
        )}
      </Flex>
    </ListProvider>
  </Flex>
}
