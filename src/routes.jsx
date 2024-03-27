import React, { useContext } from 'react';
import { Switch, Route, getRouter, Redirect, } from "navigo-react";

import { AuthContext } from './auth';

import SharedTo from './shared-to';
import List from './list';


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
    <Route path="/shared-to" before={userRequired}>
      <SharedTo/>
    </Route>
    <Route path="/list" before={userRequired}>
      <List/>
    </Route>
    <Route path="/login">
      <Redirect path={nextUserPath}/>
    </Route>
    <Route path="/">
      <a href="/shared-to?title=title&description=description&link=link">share</a>
    </Route>
  </Switch>
}
