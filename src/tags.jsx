import React from 'react';
import { Flex } from '@chakra-ui/react';
import { getRouter } from "navigo-react";
import {
  Tag
} from '@chakra-ui/react';


export default function({tags}) {
  const gotoTag = tag => e => {
    e.preventDefault();
    getRouter().navigate(`/tag/${tag}`);
  }

  return <Flex gap={1}>
    { tags.map(tag => (
      <Tag colorScheme="orange" cursor="pointer" key={tag} onClick={gotoTag(tag)}>{tag}</Tag>
    )) }
  </Flex>
}
