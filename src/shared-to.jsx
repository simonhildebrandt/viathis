import React, { useState, useEffect } from 'react';
import { useNavigo } from "navigo-react";
import {
  Input,
  FormControl,
  FormLabel,
  Button,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Heading,
  Link,
} from '@chakra-ui/react';
import { api } from './api';


const setFromEvent = setter => event => setter(event.target.value);

export default SharedTo = () => {
  const { match } = useNavigo();

  const [newTitle, setTitle] = useState('');
  const [newDescription, setDescription] = useState('');
  const [newLink, setLink] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { params } = match;

  useEffect(_ => {
    const { title = '', description = '', link = '' } = params || {};

    setTitle(title.replace(/\+/g, " "));
    setDescription(description);

    let t;
    try {
      t = new URL(link).href;
    } catch {
      try {
        t = new URL(title).href;
      } catch {
        try {
          t = new URL(description).href;
        } catch {
          t = '';
        }
      }
    }
    setLink(t);
  }, []);

  async function handleSubmit() {
    try {
      await api.post('/create', { title: newTitle, description: newDescription, link: newLink });
      setSubmitted(true);
    } catch(err) {

    }
  }

  return <>
    <Flex direction="column" gap={2} minWidth={320} maxWidth={320} mx="auto">
      <Heading size="md">Save a link</Heading>
      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input value={newTitle} onChange={setFromEvent(setTitle)}/>
      </FormControl>
      <FormControl>
        <FormLabel>Link</FormLabel>
        <Input value={newLink} onChange={setFromEvent(setLink)}/>
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Input value={newDescription} onChange={setFromEvent(setDescription)}/>
      </FormControl>
      { submitted ? (
        <Flex direction="column" gap={4}>
          <Alert status='success'>
            <AlertIcon />
            <AlertTitle>Link saved!</AlertTitle>
          </Alert>
          <Link fontWeight="bold" href="/list/inbox">View your inbox.</Link>
        </Flex>
      ) : (
        <Button type="submit" onClick={handleSubmit}>Submit</Button>
      ) }
    </Flex>
  </>
};
