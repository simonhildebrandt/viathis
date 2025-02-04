import React, { useState, useEffect } from 'react';
import {
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import TagEditor from './tag-editor';


export default function({title, description, link, tags, onDataChanged}) {
  const [newTitle, setTitle] = useState(title);
  const [newDescription, setDescription] = useState(description);
  const [newTags, setTags] = useState(tags);
  const [newLink, setLink] = useState(link);

  const setFromEvent = setter => event => {
    setter(event.target?.value || event);
  };

  useEffect(_ => {
    console.log('here')
    onDataChanged({
      title: newTitle,
      description: newDescription,
      tags: newTags,
      link: newLink,
    })
  }, [newTitle, newDescription, newTags, newLink]);

  return <Flex direction="column" gap={2}>
    <FormControl>
      <FormLabel>Title</FormLabel>
      <Input value={newTitle} onChange={setFromEvent(setTitle)}/>
    </FormControl>
    <FormControl>
      <FormLabel>Link</FormLabel>
      <Input value={newLink} onChange={setFromEvent(setLink)}/>
    </FormControl>
    <FormControl>
      <FormLabel>Tags</FormLabel>
      <TagEditor tags={tags} onChange={setFromEvent(setTags)}/>
    </FormControl>
    <FormControl>
      <FormLabel>Description</FormLabel>
      <Input value={newDescription} onChange={setFromEvent(setDescription)}/>
    </FormControl>
  </Flex>
}
