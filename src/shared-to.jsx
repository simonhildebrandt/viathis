import React, { useState, useEffect } from 'react';
import { useNavigo } from "navigo-react";
import { Input, FormControl, FormLabel, Button } from '@chakra-ui/react';
import { api } from './api';


const setFromEvent = setter => event => setter(event.target.value);

export default SharedTo = () => {
  const { match } = useNavigo();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const { params } = match;

  useEffect(_ => {
    setTitle(match.params.title);
    setDescription(match.params.description);

    let t;
    try {
      t = new URL(match.params.link).href;
    } catch {
      try {
        t = new URL(match.params.title).href;
      } catch {
        try {
          t = new URL(match.params.description).href;
        } catch {
          t = '';
        }
      }
    }
    setLink(t);
  }, []);

  function handleSubmit() {
    api.post('/create', {title, description, link});
  }

  return <>
    <FormControl>
      <FormLabel>Title</FormLabel>
      <Input value={title} onChange={setFromEvent(setTitle)}/>
    </FormControl>
    <FormControl>
      <FormLabel>Link</FormLabel>
      <Input value={link} onChange={setFromEvent(setLink)}/>
    </FormControl>
    <FormControl>
      <FormLabel>Description</FormLabel>
      <Input value={description} onChange={setFromEvent(setDescription)}/>
    </FormControl>
    <Button type="submit" onClick={handleSubmit}>Submit</Button>
    <a href="/">home</a>
  </>
};
