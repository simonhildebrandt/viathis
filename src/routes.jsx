import React, { useContext } from 'react';
import {
  Switch,
  Route,
  getRouter,
  Redirect,
  useNavigo,
} from "navigo-react";

import { Flex, Heading, Text, Link } from '@chakra-ui/react';

import { AuthContext } from './auth';

import SharedTo from './shared-to';
import List from './folder-list';
import Item from './item';
import ListLayout from './list-layout';
import Friends from './friends';

const loginKey = LWL_KEY;



function Intro({user}) {

  const nav = path => getRouter().navigate(path);

  return <Flex direction="column" mt={16} gap={4} align="center" px={16} mx="auto" maxWidth="640px">
    <Heading>Welcome to ViaThis.Link</Heading>

    { user ? (
      <>
        <Text>
          <Link color="orange.500" onClick={_ => nav('/list/inbox')}>Click here</Link> to explore your inbox,
          click here to <Link color="orange.500" onClick={_ => nav('/friends')}>check out your friends</Link>.
        </Text>
        <Text>
          <Link  color="orange.500"onClick={_ => nav('/add')}>Click here</Link> (or the + below) to try adding a new link.
        </Text>
      </>
    ) : (
      <>
        <Text>
          ViaThis.Link is a social link sharing service - keep all your favourite links in one place, and share them with your friends!
        </Text>

        <Text>
          <Link color="orange.500" href={`https://login-with.link//#/login/${loginKey}`}>Login here to get started.</Link>
        </Text>
        </>
    )}
  </Flex>
}

function WithMatch({children}) {
  const { match } = useNavigo();
  return children(match.data);
}

export default function Routes() {

  const { nextUserPath, user } = useContext(AuthContext);

  function userRequired({done, match})  {
    const { url, queryString } = match;
    if (!user) {
      getRouter().navigate(`/?msg=not-authed&returnTo=${encodeURIComponent('/' + url + '?' + queryString)}`);
      done(false);
    } else {
      done(true);
    }
  }

  return <Switch>
    <Route path="/add" before={userRequired}>
      <ListLayout folder={null}><SharedTo/></ListLayout>
    </Route>
    <Route path="/list/:folder" before={userRequired}>
      <WithMatch>
        { ({folder}) => <ListLayout folder={folder}><List folder={folder}/></ListLayout> }
      </WithMatch>
    </Route>
    <Route path="/item/:item(/:action)?" before={userRequired}>
      <WithMatch>
        { ({item, action}) => <ListLayout folder={null}><Item item={item} action={action}/></ListLayout> }
      </WithMatch>
    </Route>
    <Route path="/friends" before={userRequired}>
      <ListLayout folder={null} page="friends"><Friends/></ListLayout>
    </Route>
    <Route path="/login">
      <Redirect path={nextUserPath}/>
    </Route>
    <Route path="/">
      <Intro user={user}/>
    </Route>
  </Switch>
}
