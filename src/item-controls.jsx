import React, { useContext } from 'react';
import {
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { MdArchive, MdMoveToInbox, MdShare, MdEdit } from "react-icons/md";
import { getRouter } from "navigo-react";

import { api } from './api';


export default function({ item, mutate, editing, onEdit, onSave, onClose }) {
  const { _id, archived } = item;

  const archive = _ => api.post(`/item/${_id}/archive`).then(_ => mutate());
  const inbox = _ => api.post(`/item/${_id}/inbox`).then(_ => mutate());
  const share = _ => getRouter().navigate(`item/${_id}/share`);

  return <Flex direction="column" gap={2}>
    { archived == true ?
      <IconButton icon={<MdMoveToInbox onClick={inbox} size={24}/>}/>
      :
      <IconButton icon={<MdArchive onClick={archive} size={24}/>}/>

    }
    <IconButton icon={<MdShare onClick={share} size={24}/>}/>
    <IconButton icon={<MdEdit onClick={onEdit} size={24}/>}/>
  </Flex>
}
