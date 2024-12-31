import React from 'react';
import {
  IconButton,
  Box,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { getRouter } from "navigo-react";

export default function() {
  function goToShare() {
    getRouter().navigate(`/add`);
  }

  return <Box pos="absolute" right={8} bottom={8}>
    <IconButton
    onClick={goToShare}
    size="lg"
    icon={<AddIcon/>}
    isRound
    colorScheme="orange"
  />
  </Box>
}
