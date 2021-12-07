import { useState, useEffect, useContext } from 'react';
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';
import './App.css';
import { realmApp, Authentication } from './realm';
import Context from './components/Context';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Todo from './components/Todo';
import Welcome from './components/Welcome';

const PrivateRoute = (props) => {
  const location = useLocation();
  const { isLoggedIn } = useContext(Context);

  return isLoggedIn ? (
    <Route {...props} />
  ) : (
    <Redirect
      to={{
        pathname: '/',
        state: { from: location },
      }}
    />
  );
};

const App = () => {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log(realmApp.currentUser?.isLoggedIn);
    setIsLoggedIn(!!realmApp.currentUser?.isLoggedIn);
  }, [realmApp.currentUser?.isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      history.push('/todo');
    }
  }, [isLoggedIn]);

  const onLogIn = async (username, password) => {
    const user = await Authentication.logIn(username, password);
    if (user?.isLoggedIn) {
      setIsLoggedIn(true);
      history.push('/todo');
    }
  };

  const onLogOut = () => {
    Authentication.logOut();
    setIsLoggedIn(false);
  };

  return (
    <>
      <Context.Provider value={{ onLogIn, isLoggedIn }}>
        <div>
          <Link to="/">
            <h1>Realm Todo</h1>
          </Link>
          {isLoggedIn && <button onClick={onLogOut}>Log Out</button>}
        </div>
        <Switch>
          <Route path="/" component={Welcome} exact />
          <Route path="/log-in" component={LogIn} />
          <Route path="/sign-up" component={SignUp} />
          <PrivateRoute path="/todo" component={Todo} />
        </Switch>
      </Context.Provider>
    </>
  );
};

// defining Router in a separate component so that the App component
// has access to the `useHistory` hook.
// See https://stackoverflow.com/a/68173854/17093063
const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);
export default AppWithRouter;
