import React, { useContext } from 'react';
import {
  IconButton,
} from '@chakra-ui/react';
import { MdArchive, MdMoveToInbox } from "react-icons/md";

import { api } from './api';
import { ListContext } from './folder-context';


export default function({ item }) {
  const { _id, archived } = item;
  const { mutate } = useContext(ListContext);

  const archive = _ => api.post(`/item/${_id}/archive`).then(_ => mutate());
  const inbox = _ => api.post(`/item/${_id}/inbox`).then(_ => mutate());

  return archived == true ?
    <IconButton icon={<MdMoveToInbox onClick={inbox} size={24}/>}/>
    :
    <IconButton icon={<MdArchive onClick={archive} size={24}/>}/>
}
