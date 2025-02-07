import React from 'react';
import { Flex } from '@chakra-ui/react';
import { getRouter } from "navigo-react";
import {
  Link
} from '@chakra-ui/react';


export default function({tags}) {
  const gotoTag = tag => e => {
    e.preventDefault();
    getRouter().navigate(`/tag/${tag}`);
  }

  return <Flex>
    { tags.map(tag => (
      <Link key={tag} onClick={gotoTag(tag)}>{tag}</Link>
    )) }
  </Flex>
}
