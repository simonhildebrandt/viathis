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
import LinkForm from './link-form';


export default SharedTo = () => {
  const { match } = useNavigo();
  const [submitted, setSubmitted] = useState(false);
  const { params } = match;
  const [data, setData] = useState({});

  const { title = '', description = '', link = '' } = params || {};

  const cleanTitle = title.replace(/\+/g, " ");
  const cleanDescription = description;

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
  const cleanLink = t;

  async function handleSubmit() {
    try {
      await api.post('/create', data);
      setSubmitted(true);
    } catch(err) {

    }
  }

  return <>
    <Flex direction="column" gap={2} minWidth={320} maxWidth={320} mx="auto">
      <Heading size="md">Save a link</Heading>
      <LinkForm onDataChanged={setData} title={cleanTitle} description={cleanDescription} link={cleanLink} tags={['untagged']}/>
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
