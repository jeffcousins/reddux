import React from 'react';
import { Route } from 'react-router';
import App from './components/App';
import BrewContent from './components/BrewContent';
import UserDetail from './components/UserDetail';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import Thread from './components/Thread';
import ReqAuth from './components/ReqAuth';
import CreateBrew from './components/CreateBrew';
import SubmitPost from './components/SubmitPost';

// TODO: IndexRoute for brew header

const createRoutes = (props) => (
  <Route path='/' component={App} >
    <Route path='b/:b' component={BrewContent} />
    <Route path='b/:b/submit' component={SubmitPost} />
    <Route path='u/:u' component={UserDetail} />
    <Route path='signup' component={SignUp} />
    <Route path='signin' component={SignIn} />
    <Route path='signout' component={SignOut} />
    <Route path='thread/:postId' component={Thread} />
    <Route path='brews/create' component={ReqAuth(CreateBrew)} />
    <Route path='*' component={BrewContent} />
  </Route>
);

export default createRoutes;
