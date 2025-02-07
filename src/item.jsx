import React, { useState } from 'react';
import {
  Heading,
  Text,
  Link,
  Flex,
  useDisclosure,
  Button,
} from '@chakra-ui/react';

import { useAPISWR, api } from './api';
import SharePanel from './share-panel';
import ShareDialog from './share-dialog';
import { getRouter } from 'navigo-react';
import ItemControls from './item-controls';
import Tags from './tags';
import LinkForm from './link-form';



export default function Item({ item, action }) {
  const { data: itemData, mutate } = useAPISWR(`/item/${item}`);
  const { isOpen, onClose } = useDisclosure({defaultIsOpen: action == '/share'})
  const { isOpen: isEditing, onOpen: onEditingOpen, onClose: onEditingClose } = useDisclosure({defaultIsOpen: action == '/edit'});
  const [data, setData] = useState({});

  function hide() {
    getRouter().navigate(`/item/${item}`);
    onClose();
  }

  async function handleSubmit() {
    try {
      await api.post(`/item/${item}`, data);
      getRouter().navigate(`/item/${item}`);
    } catch(err) {

    }
  }

  if (!itemData) return 'loading';

  const {
    title,
    sharedBy,
    shareMessage,
    createdAt,
    description,
    link,
    tags,
    archived
  } = itemData;

  if (isEditing) {
    return <Flex flexGrow={1} direction="column" gap={4}>
      <LinkForm onDataChanged={setData} title={title} description={description} link={link} tags={tags}/>
      <Flex justify="flex-end" gap={4}>
        <Button colorScheme="green" onClick={handleSubmit}>Save</Button>
        <Button colorScheme="red" onClick={hide}>Cancel</Button>
      </Flex>
    </Flex>
  }

  return <Flex mt={8} flexGrow={1} mr={2} gap={2}>
    <Flex direction="column" gap={8} flexGrow={1}>
    { /* <SharePanel isOpen={isOpen} hide={hide}/> */}
      <ShareDialog isOpen={isOpen} hide={hide} id={item}/>
      <Flex gap={4} direction="column" flexGrow={1}>
        <Heading>{title}</Heading>
        { sharedBy && <Flex>
          <Text fontStyle="italic">Shared by {sharedBy}{ shareMessage && `- ${shareMessage}`}</Text>
        </Flex> }
        <Text fontSize="xs">{new Date(createdAt).toLocaleString()}</Text>
        <Tags tags={tags}/>
        <Text>{description}</Text>
        <Link href={link} isExternal>{link}</Link>
      </Flex>
    </Flex>

    <ItemControls
      item={{_id: item, archived}}
       mutate={mutate}
    />
  </Flex>
}
