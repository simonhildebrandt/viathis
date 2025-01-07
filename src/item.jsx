import React from 'react';
import {
  Heading,
  Text,
  Link,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';

import { useAPISWR } from './api';
import SharePanel from './share-panel';
import ShareDialog from './share-dialog';
import { getRouter } from 'navigo-react';
import ItemControls from './item-controls';


export default function Item({ item, action }) {
  const { data: itemData, mutate } = useAPISWR(`/item/${item}`);
  const { isOpen, onClose } = useDisclosure({defaultIsOpen: action == '/share'})

  function hide() {
    getRouter().navigate(`/item/${item}`);
    onClose();
  }

  if (!itemData) return 'loading';

  const {
    title,
    sharedBy,
    shareMessage,
    createdAt,
    description,
    link,
    archived
  } = itemData;

  return <Flex mt={8} flexGrow={1} mr={2} gap={2}>
    <Flex direction="column" gap={8} flexGrow={1}>
    { /* <SharePanel isOpen={isOpen} hide={hide}/> */}
      <ShareDialog isOpen={isOpen} hide={hide} id={item}/>
      <Flex gap={4} direction="column" flexGrow={1}>
        <Heading>{title}</Heading>
        { sharedBy && <Flex>
          <Text fontStyle="italic">Shared by {sharedBy}{ shareMessage && `- ${shareMessage}`}</Text>
        </Flex> }
        <Text>{new Date(createdAt).toLocaleString()}</Text>
        <Link href={link} isExternal>{link}</Link>
        <Text>{description}</Text>
      </Flex>
    </Flex>
    <ItemControls item={{_id: item, archived}} mutate={mutate}/>
  </Flex>
}
