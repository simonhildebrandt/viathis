import React, { useState, useEffect, createContext, useContext } from 'react';
import { Switch, Route, getRouter, Redirect, useNavigo } from "navigo-react";

import { AuthContext } from './auth';




const SharedTo = () => {
  const { match } = useNavigo();

  const { params } = match;
  console.log({params});
  return <>
    { JSON.stringify(params) }
    <a href="/">home</a>
  </>
};

export default function Routes() {

  const { nextUserPath, user } = useContext(AuthContext);

  console.log({nextUserPath})

  function authedRoute({done, match})  {
    const { url, queryString } = match;
    if (!user) {
      getRouter().navigate(`/?msg=not-authed&returnTo=${encodeURIComponent('/' + url + '?' + queryString)}`);
      done(false);
    } else {
      done(true);
    }
  }

  return <Switch>
    <Route path="/shared-to" before={authedRoute}>
      <SharedTo/>
    </Route>
    <Route path="/login">
      <Redirect path={nextUserPath}/>
    </Route>
    <Route path="/">
      <a href="/shared-to?title=title&description=description&link=link">share</a>
    </Route>
  </Switch>
}
