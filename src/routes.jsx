import React, { useContext } from 'react';
import {
  Switch,
  Route,
  getRouter,
  Redirect,
  useNavigo,
} from "navigo-react";

import { AuthContext } from './auth';

import SharedTo from './shared-to';
import List from './folder-list';
import Item from './item';
import ListLayout from './list-layout';
import Friends from './friends';

const loginKey = LWL_KEY;


function WithMatch({children, field}) {
  const { match } = useNavigo();

  return children(match.data[field]);
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
      <SharedTo/>
    </Route>
    <Route path="/list/:folder" before={userRequired}>
      <WithMatch field="folder">
        { folder => <ListLayout folder={folder}><List folder={folder}/></ListLayout> }
      </WithMatch>
    </Route>
    <Route path="/item/:item" before={userRequired}>
      <WithMatch field="item">
        { item => <ListLayout folder={null}><Item item={item}/></ListLayout> }
      </WithMatch>
    </Route>
    <Route path="/friends" before={userRequired}>
      <ListLayout folder={null} page="friends"><Friends/></ListLayout>
    </Route>
    <Route path="/login">
      <Redirect path={nextUserPath}/>
    </Route>
    <Route path="/">
      { user ? (
        <>
          <a href="/list/inbox">inbox</a>
        </>
      ) : (
        <a href={`https://login-with.link//#/login/${loginKey}`}>Login</a>
      ) }
    </Route>
  </Switch>
}
